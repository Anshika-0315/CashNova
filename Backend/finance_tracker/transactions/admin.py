from django.contrib import admin
from .models import Category, Transaction, Budget, UserAlert, Goal, GoalTransaction, RecurringPayment
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'user')
    list_filter = ('type', 'user')
    search_fields = ('name', 'user__username')
    ordering = ('type', 'name')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'amount', 'transaction_type', 'category',
        'description', 'date', 'created_at'
    )
    list_filter = ('transaction_type', 'category', 'date', 'user')
    search_fields = ('user__username', 'description', 'category__name')
    ordering = ('-date', '-created_at')


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'category', 'amount', 'budget_type',
        'year', 'month', 'start_date', 'end_date',
        'is_over_budget', 'remaining_budget'
    )
    list_filter = (
        'user', 'category', 'budget_type', 'year', 'month',
        'start_date', 'end_date'
    )
    search_fields = ('user__username', 'category__name')
    ordering = ('-start_date', 'category__name')

    readonly_fields = (
        'remaining_budget',
        'current_spending',
        'is_over_budget',
        'budget_progress_percentage'
    )


@admin.register(UserAlert)
class UserAlertAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'type', 'message', 'category', 'budget',
        'is_dismissed', 'created_at'
    )
    list_filter = ('type', 'is_dismissed', 'created_at')
    search_fields = (
        'message', 'user__username',
        'category__name', 'budget__category__name'
    )
    readonly_fields = ('created_at',)


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'user', 'target_amount', 'saved_amount',
        'target_date', 'is_completed'
    )
    list_filter = ('is_completed', 'target_date')
    search_fields = ('name', 'user__username')


@admin.register(GoalTransaction)
class GoalTransactionAdmin(admin.ModelAdmin):
    list_display = ('goal', 'user', 'amount', 'date')
    list_filter = ('date',)
    search_fields = ('goal__name', 'user__username')


admin.site.register(RecurringPayment)