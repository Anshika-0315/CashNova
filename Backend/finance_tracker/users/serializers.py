from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ContactMessage
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    profilePhoto = serializers.ImageField(source='profile_photo', required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password',
            'name', 'mobile', 'gender', 'dob', 'profilePhoto'
        )

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'mobile', 'gender', 'dob', 'profile_photo']
        read_only_fields = ['username', 'email']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
