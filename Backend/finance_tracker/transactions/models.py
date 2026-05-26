from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
import calendar
from datetime import datetime
from datetime import timedelta
from dateutil.relativedelta import relativedelta

User = get_user_model()


class Category(models.Model):
    class CategoryType(models.TextChoices):
        INCOME = 'INCOME', 'Income'
        EXPENSE = 'EXPENSE', 'Expense'

    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=10,
        choices=CategoryType.choices,
        default=CategoryType.EXPENSE,
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    # If user is null, it's a default system category

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ('user', 'name', 'type')  # Ensures unique categories per user

    def __str__(self):
        return f"{self.name} ({self.type})"


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='transactions', null=True, blank=True)
    transaction_type = models.CharField(
        max_length=10,
        choices=Category.CategoryType.choices,
        default=Category.CategoryType.EXPENSE,
    )
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']  # Order by date descending, then creation time

    def __str__(self):
        return f"{self.user.username} - {self.description or 'No Description'} - {self.amount}"


def current_year():
    return datetime.now().year


class Budget(models.Model):
    class BudgetType(models.TextChoices):
        MONTHLY = 'MONTHLY', _('Monthly')
        ANNUAL = 'ANNUAL', _('Annual')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='budgets',
        limit_choices_to={'type': 'EXPENSE'}
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    budget_type = models.CharField(
        max_length=10,
        choices=BudgetType.choices,
        default=BudgetType.MONTHLY
    )
    year = models.PositiveIntegerField(default=current_year)
    month = models.PositiveSmallIntegerField(null=True, blank=True)  # Only for monthly budgets

    start_date = models.DateField(editable=False)
    end_date = models.DateField(editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'category', 'budget_type', 'year', 'month')
        ordering = ['-start_date', 'category__name']

    def save(self, *args, **kwargs):
        if self.budget_type == self.BudgetType.MONTHLY and self.month:
            self.start_date = f"{self.year}-{self.month:02d}-01"
            last_day = calendar.monthrange(self.year, self.month)[1]
            self.end_date = f"{self.year}-{self.month:02d}-{last_day}"
        elif self.budget_type == self.BudgetType.ANNUAL:
            self.start_date = f"{self.year}-01-01"
            self.end_date = f"{self.year}-12-31"
        else:
            raise ValueError("Invalid budget type or missing month for monthly budget.")
        super().save(*args, **kwargs)

    def __str__(self):
        label = f"{calendar.month_name[self.month]} {self.year}" if self.budget_type == 'MONTHLY' else str(self.year)
        return f"{self.user.username}'s {self.budget_type.title()} Budget for {self.category.name}: ${self.amount} ({label})"

    @property
    def current_spending(self):
        total = self.user.transactions.filter(
            category=self.category,
            transaction_type='EXPENSE',
            date__gte=self.start_date,
            date__lte=self.end_date
        ).aggregate(models.Sum('amount'))['amount__sum']
        return total or 0

    @property
    def remaining_budget(self):
        return self.amount - self.current_spending

    @property
    def is_over_budget(self):
        return self.current_spending > self.amount

    @property
    def budget_progress_percentage(self):
        if self.amount == 0:
            return 0
        return min(100, (self.current_spending / self.amount) * 100)


class UserAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    type = models.CharField(max_length=20)  # e.g., 'warning', 'info'
    created_at = models.DateTimeField(auto_now_add=True)
    is_dismissed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} Alert - {self.message[:40]}"


class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    target_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    goal_completed_seen = models.BooleanField(default=False)
    goal_missed_seen = models.BooleanField(default=False)
    completed_on = models.DateField(null=True, blank=True)  # <-- Add this line


    def expected_daily_saving(self):
        remaining = self.target_amount - self.saved_amount
        remaining_days = (self.target_date - datetime.now().date()).days
        return round(remaining / max(1, remaining_days), 2)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class GoalTransaction(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='contributions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.goal.saved_amount += self.amount
            if self.goal.saved_amount >= self.goal.target_amount and not self.goal.is_completed:
                self.goal.is_completed = True
                if not self.goal.completed_on:
                    self.goal.completed_on = datetime.now().date()
            self.goal.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} → {self.goal.name} (${self.amount})"



class RecurringPayment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recurring_payments')
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    repeat_interval = models.CharField(
        max_length=20,
        choices=[('DAILY', 'Daily'), ('WEEKLY', 'Weekly'), ('MONTHLY', 'Monthly'), ('YEARLY', 'Yearly')],
        default='MONTHLY'
    )
    next_due_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username}) - ₹{self.amount}"

    def calculate_next_due_date(self):

        if self.repeat_interval == 'DAILY':
            return self.next_due_date + timedelta(days=1)
        elif self.repeat_interval == 'WEEKLY':
            return self.next_due_date + timedelta(weeks=1)
        elif self.repeat_interval == 'MONTHLY':
            return self.next_due_date + relativedelta(months=1)
        elif self.repeat_interval == 'YEARLY':
            return self.next_due_date + relativedelta(years=1)
        return self.next_due_date



class DismissedRecurringAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dismissed_recurring_alerts')
    recurring_payment = models.ForeignKey(RecurringPayment, on_delete=models.CASCADE)
    dismissed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recurring_payment')
