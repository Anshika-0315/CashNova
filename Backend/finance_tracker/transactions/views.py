from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Transaction, Budget, UserAlert, Goal, GoalTransaction, RecurringPayment, DismissedRecurringAlert
from .serializers import (
    CategorySerializer, TransactionSerializer, BudgetSerializer,
    UserAlertSerializer, GoalSerializer, GoalTransactionSerializer, ContributionSerializer, RecurringPaymentSerializer
)
from django.db.models import Q, Sum
from django.db.models.functions import TruncMonth, TruncYear
from datetime import datetime, date
from rest_framework.decorators import action, api_view, permission_classes
from django.utils import timezone
from django.utils.timezone import now
from datetime import timedelta
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from calendar import monthrange




class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user__isnull=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get('start_date')
        end_date   = self.request.query_params.get('end_date')
        category_id     = self.request.query_params.get('category')
        transaction_type = self.request.query_params.get('type')
        search_query     = self.request.query_params.get('search')

        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if year and year.isdigit():
            queryset = queryset.filter(date__year=int(year))
        if month and month.isdigit():
            queryset = queryset.filter(date__month=int(month))
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type.upper())
        if search_query:
            queryset = queryset.filter(description__icontains=search_query)

        return queryset.order_by('-date', '-created_at')


    def perform_create(self, serializer):
        transaction = serializer.save(user=self.request.user)
        if transaction.transaction_type == 'EXPENSE' and transaction.category:
            budgets = Budget.objects.filter(
                user=transaction.user,
                category=transaction.category,
                start_date__lte=transaction.date,
                end_date__gte=transaction.date
            )
            for budget in budgets:
                current = budget.current_spending
                amount = budget.amount
                percent = budget.budget_progress_percentage

                recent_alerts = UserAlert.objects.filter(
                    user=transaction.user,
                    budget=budget,
                    is_dismissed=False
                ).order_by('-created_at')

                if current > amount and not recent_alerts.filter(type="warning").exists():
                    UserAlert.objects.create(
                        user=transaction.user,
                        budget=budget,
                        category=budget.category,
                        type="warning",
                        message=f"You are ₹{current - amount:.2f} over budget for '{budget.category.name}' this period."
                    )
                elif percent >= 90 and not recent_alerts.filter(type="info").exists():
                    UserAlert.objects.create(
                        user=transaction.user,
                        budget=budget,
                        category=budget.category,
                        type="info",
                        message=f"You are {percent:.0f}% through your budget for '{budget.category.name}' this period."
                    )

    def perform_update(self, serializer):
        old_instance = self.get_object()
        new_instance = serializer.save(user=self.request.user)

        if old_instance.description and "Saved for goal:" in old_instance.description:
            goal_name = old_instance.description.split(":")[-1].strip()
            try:
                goal = Goal.objects.get(name=goal_name, user=self.request.user)
                # Try to find the matching GoalTransaction
                goal_txn_qs = GoalTransaction.objects.filter(
                    user=self.request.user,
                    goal=goal,
                    amount=old_instance.amount,
                    date=old_instance.date
                )
                if goal_txn_qs.exists():
                    for goal_txn in goal_txn_qs:
                        goal_txn.amount = new_instance.amount
                        goal_txn.date = new_instance.date
                        goal_txn.save()
                # Always recalculate
                self.update_goal_status(goal)
            except Goal.DoesNotExist:
                pass
            except Exception as e:
                print("Error updating GoalTransaction:", e)

    def perform_destroy(self, instance):
        if instance.description and "Saved for goal:" in instance.description:
            goal_name = instance.description.split(":")[-1].strip()
            try:
                goal = Goal.objects.get(name=goal_name, user=self.request.user)
                # Try to find and delete all matching GoalTransactions
                goal_txn_qs = GoalTransaction.objects.filter(
                    user=self.request.user,
                    goal=goal,
                    amount=instance.amount,
                    date=instance.date
                )
                deleted_count, _ = goal_txn_qs.delete()
                # Always recalculate
                self.update_goal_status(goal)
            except Goal.DoesNotExist:
                pass
            except Exception as e:
                print("Error deleting GoalTransaction:", e)
        instance.delete()


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user).order_by('-start_date', 'category__name')
        status_filter = self.request.query_params.get('status')
        today = date.today()
        if status_filter == 'active':
            queryset = queryset.filter(start_date__lte=today, end_date__gte=today)
        elif status_filter == 'future':
            queryset = queryset.filter(start_date__gt=today)
        elif status_filter == 'past':
            queryset = queryset.filter(end_date__lt=today)

        budget_type = self.request.query_params.get('budget_type')
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')

        if budget_type:
            queryset = queryset.filter(budget_type=budget_type.upper())
        if year and year.isdigit():
            queryset = queryset.filter(year=int(year))
        if month and month.isdigit():
            queryset = queryset.filter(month=int(month))

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class FinanceSummaryView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        filters = Q(user=user)
        if year:
            filters &= Q(date__year=year)
        if month:
            filters &= Q(date__month=month)

        transactions = Transaction.objects.filter(filters)
        total_income = transactions.filter(transaction_type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = transactions.filter(transaction_type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": total_income - total_expense
        })


class AlertViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        alerts = UserAlert.objects.filter(user=request.user, is_dismissed=False).order_by('-created_at')
        serializer = UserAlertSerializer(alerts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='dismiss')
    def dismiss(self, request, pk=None):
        try:
            alert = UserAlert.objects.get(pk=pk, user=request.user)
            alert.is_dismissed = True
            alert.save()
            return Response({'status': 'Alert dismissed'})
        except UserAlert.DoesNotExist:
            return Response({'error': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='dismiss-all')
    def dismiss_all(self, request):
        UserAlert.objects.filter(user=request.user, is_dismissed=False).update(is_dismissed=True)
        return Response({'status': 'All alerts dismissed'})


@api_view(['GET'])
def top_spending_categories(request):
    user = request.user
    year = request.query_params.get('year')
    month = request.query_params.get('month')

    filters = {'user': user, 'transaction_type': 'EXPENSE'}
    if year:
        filters['date__year'] = year
    if month:
        filters['date__month'] = month

    category_summary = (
        Transaction.objects
        .filter(**filters)
        .values('category__name')
        .annotate(total_spent=Sum('amount'))
        .order_by('-total_spent')[:5]
    )

    return Response(category_summary)


@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # <--- Add this line

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update_goal_status(self, goal):
        today = timezone.now().date()
        saved = GoalTransaction.objects.filter(goal=goal, user=goal.user).aggregate(total=Sum('amount'))['total'] or 0
        goal.saved_amount = saved
        if goal.saved_amount >= goal.target_amount:
            goal.is_completed = True
            if not goal.completed_on:
                goal.completed_on = today  # <-- Set completed_on date
        elif today > goal.target_date and goal.saved_amount < goal.target_amount:
            goal.is_completed = False
        else:
            goal.is_completed = False
        goal.save()

    @action(detail=False, methods=["get"])
    def check_status(self, request):
        goals = Goal.objects.filter(user=request.user)
        today = timezone.now().date()
        completed = []
        missed = []

        for goal in goals:
            # Update the status first
            self.update_goal_status(goal)

            is_completed = goal.is_completed
            is_missed = not goal.is_completed and today > goal.target_date

            if is_completed and not goal.goal_completed_seen:
                completed.append(goal.name)
            elif is_missed and not goal.goal_missed_seen:
                missed.append(goal.name)

        return Response({
            'completed': completed,
            'missed': missed
        })

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        goal = self.get_object()
        transactions = GoalTransaction.objects.filter(user=request.user, goal=goal).order_by('-date')
        data = [
            {
                "amount": t.amount,
                "date": t.date,
                "goal": goal.name
            } for t in transactions
        ]
        return Response(data)

    @action(detail=True, methods=['post'])
    def contribute(self, request, pk=None):
        goal = self.get_object()
        serializer = ContributionSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            date = request.data.get('date', timezone.now().date())

            GoalTransaction.objects.create(
                user=request.user,
                goal=goal,
                amount=amount,
                date=date
            )

            self.update_goal_status(goal)

            category, _ = Category.objects.get_or_create(
                name="Goal Savings",
                user=request.user,
                defaults={"type": "EXPENSE"}
            )

            Transaction.objects.create(
                user=request.user,
                amount=amount,
                transaction_type="EXPENSE",
                category=category,
                description=f"Saved for goal: {goal.name}",
                date=date
            )

            return Response({'status': 'Contribution saved and transaction logged'}, status=201)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
def mark_goal_seen(request, pk):
    try:
        goal = Goal.objects.get(id=pk, user=request.user)
        today = timezone.now().date()
        is_completed = goal.is_completed
        is_missed = not goal.is_completed and today > goal.target_date
        
        if is_completed:
            goal.goal_completed_seen = True
        elif is_missed:
            goal.goal_missed_seen = True
        goal.save()
        return Response({'success': True})
    except Goal.DoesNotExist:
        return Response({'error': 'Goal not found'}, status=404)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_summary(request):
    year = int(request.GET.get('year', datetime.now().year))
    month = int(request.GET.get('month', datetime.now().month))
    monthly_transactions = Transaction.objects.filter(
        user=request.user, date__year=year, date__month=month
    )
    income = monthly_transactions.filter(transaction_type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
    expense = monthly_transactions.filter(transaction_type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0
    return Response({"income": income, "expense": expense})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def annual_summary(request):
    year = int(request.GET.get('year', datetime.now().year))
    transactions = Transaction.objects.filter(user=request.user, date__year=year)
    income = transactions.filter(transaction_type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
    expense = transactions.filter(transaction_type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0
    return Response({"income": income, "expense": expense})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_breakdown(request):
    year = int(request.GET.get('year', datetime.now().year))
    month = request.GET.get('month', None)
    qs = Transaction.objects.filter(user=request.user, date__year=year)
    if month:
        qs = qs.filter(date__month=int(month))
    breakdown = qs.values('category__name', 'transaction_type').annotate(total_amount=Sum('amount'))
    return Response(breakdown)



class RecurringPaymentViewSet(viewsets.ModelViewSet):
    queryset = RecurringPayment.objects.all()
    serializer_class = RecurringPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        today = now().date()
        upcoming_date = today + timedelta(days=7)
        upcoming = self.get_queryset().filter(next_due_date__range=[today, upcoming_date])
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        today = now().date()
        upcoming_date = today + timedelta(days=7)
        dismissed_ids = DismissedRecurringAlert.objects.filter(user=request.user).values_list('recurring_payment_id', flat=True)
        upcoming = self.get_queryset().filter(
            next_due_date__range=[today, upcoming_date]
        ).exclude(id__in=dismissed_ids)
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dismiss_recurring_alert(request, pk):
    try:
        rp = RecurringPayment.objects.get(pk=pk, user=request.user)
        DismissedRecurringAlert.objects.get_or_create(user=request.user, recurring_payment=rp)
        return Response({'status': 'dismissed'})
    except RecurringPayment.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_breakdown(request):
    year = int(request.GET.get('year', datetime.now().year))
    user = request.user
    results = []
    for m in range(1, 13):
        transactions = Transaction.objects.filter(user=user, date__year=year, date__month=m)
        income = transactions.filter(transaction_type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
        expense = transactions.filter(transaction_type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0
        results.append({
            "month": m,
            "income": income,
            "expense": expense
        })
    return Response(results)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_breakdown(request):
    year = int(request.GET.get('year', datetime.now().year))
    month = int(request.GET.get('month', datetime.now().month))
    user = request.user
    num_days = monthrange(year, month)[1]
    results = []
    for day in range(1, num_days + 1):
        transactions = Transaction.objects.filter(user=user, date__year=year, date__month=month, date__day=day)
        income = transactions.filter(transaction_type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
        expense = transactions.filter(transaction_type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0
        results.append({
            "day": day,
            "income": income,
            "expense": expense
        })
    return Response(results)
