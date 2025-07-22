"""
URL configuration for finance_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """



from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

from transactions.views import (
    CategoryViewSet,
    TransactionViewSet,
    FinanceSummaryView,
    BudgetViewSet,
    AlertViewSet,
    GoalViewSet,
    RecurringPaymentViewSet,
    mark_goal_seen,
    top_spending_categories,
    monthly_summary,
    annual_summary,
    category_breakdown,
    dismiss_recurring_alert,
    monthly_breakdown,
    daily_breakdown,
)

from users import views  # Your custom user views

# DRF router setup
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'summary', FinanceSummaryView, basename='summary')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'recurring-payments', RecurringPaymentViewSet)


# CSRF cookie endpoint
def get_csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),

    # Django REST Framework login/logout for browsable API
    path('api-auth/', include('rest_framework.urls')),

    # Custom auth/user-related endpoints
    path('api/register/', views.register_view, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('api/me/', views.me_view, name='me'),  # View or update profile
    path('api/change-password/', views.change_password, name='change_password'),
    path('api/contact/', views.contact_message_view, name='contact-message'),
    path('goals/<int:pk>/mark_seen/', mark_goal_seen, name='mark-seen'),
    path('api/summary/monthly_summary/', monthly_summary),
    path('api/summary/annual_summary/', annual_summary),
    path('api/summary/category_breakdown/', category_breakdown),
    path('api/recurring-payments/<int:pk>/dismiss/', dismiss_recurring_alert, name='dismiss-recurring-alert'),
    # Custom transaction insights endpoint
    path('spending-insights/', top_spending_categories, name='spending-insights'),
    path('api/summary/monthly_breakdown/', monthly_breakdown),  # <-- Add this line
     path('api/summary/daily_breakdown/', daily_breakdown),

    # API endpoints using DRF routers
    path('api/', include(router.urls)),

    # CSRF token endpoint for frontend integration
    path('csrf/', ensure_csrf_cookie(get_csrf)),
]

# Static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)








