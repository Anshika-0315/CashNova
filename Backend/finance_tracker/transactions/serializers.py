from rest_framework import serializers
from .models import Category, Transaction, Budget, UserAlert, GoalTransaction, Goal, RecurringPayment
import calendar

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'user']
        read_only_fields = ['user']


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_type = serializers.CharField(source='category.type', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'amount', 'description', 'category', 'category_name',
            'category_type', 'transaction_type', 'date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'category_name', 'category_type']


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_type = serializers.CharField(source='category.type', read_only=True)
    current_spending = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    remaining_budget = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_over_budget = serializers.BooleanField(read_only=True)
    budget_progress_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id', 'user', 'category', 'category_name', 'category_type', 'amount',
            'budget_type', 'year', 'month', 'start_date', 'end_date',
            'current_spending', 'remaining_budget', 'is_over_budget', 'budget_progress_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'user', 'start_date', 'end_date', 'created_at', 'updated_at',
            'category_name', 'category_type', 'current_spending',
            'remaining_budget', 'is_over_budget', 'budget_progress_percentage'
        ]

    def validate(self, data):
        category = data.get('category')
        budget_type = data.get('budget_type')
        month = data.get('month')

        if category and category.type != 'EXPENSE':
            raise serializers.ValidationError({"category": "Only expense categories can be assigned to budgets."})

        if budget_type == Budget.BudgetType.MONTHLY and not month:
            raise serializers.ValidationError({"month": "Month is required for monthly budgets."})

        if budget_type == Budget.BudgetType.ANNUAL and month:
            raise serializers.ValidationError({"month": "Month should not be set for annual budgets."})

        if month and (month < 1 or month > 12):
            raise serializers.ValidationError({"month": "Month must be between 1 and 12."})

        return data


class UserAlertSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    budget_category_name = serializers.CharField(source='budget.category.name', read_only=True)

    class Meta:
        model = UserAlert
        fields = [
            'id', 'user', 'type', 'message', 'category', 'category_name',
            'budget', 'budget_category_name', 'is_dismissed', 'created_at'
        ]


class GoalTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalTransaction
        fields = '__all__'


class GoalSerializer(serializers.ModelSerializer):
    contributions = GoalTransactionSerializer(many=True, read_only=True)
    expected_daily_saving = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = '__all__'  # completed_on will be included if it's a model field
        read_only_fields = ['user']

    def get_expected_daily_saving(self, obj):
        return obj.expected_daily_saving()


class ContributionSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class RecurringPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringPayment
        fields = '__all__'
        read_only_fields = ['user']