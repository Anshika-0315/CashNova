from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'name', 'mobile', 'gender', 'dob', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'gender')
    search_fields = ('username', 'email', 'name', 'mobile')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal Info'), {'fields': ('name', 'email', 'mobile', 'gender', 'dob', 'profile_photo')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'name', 'mobile', 'gender', 'dob', 'profile_photo'),
        }),
    )
