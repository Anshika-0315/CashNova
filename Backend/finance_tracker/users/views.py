# users/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status,viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from .serializers import UserCreateSerializer,CustomUserProfileSerializer,ContactMessageSerializer
from .models import CustomUser
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags, format_html

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        # Send beautiful thank you email to user
        try:
            user_email = serializer.validated_data.get('email')
            user_name = serializer.validated_data.get('name') or user.username

            html_message = render_to_string('emails/registration_thankyou.html', {
                'user_name': user_name,
            })
            plain_message = strip_tags(html_message)
            subject = "🎉 Welcome to CashNova!"

            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                html_message=html_message,
                fail_silently=False,
            )

            # Send beautiful HTML admin notification for new user registration
            admin_html = render_to_string('emails/admin_new_user.html', {
                'user_name': user_name,
                'user_email': user_email,
            })
            admin_plain = strip_tags(admin_html)
            admin_subject = f"👤 New User Registered: {user_name}"

            send_mail(
                admin_subject,
                admin_plain,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],  # Or your admin email
                html_message=admin_html,
                fail_silently=False,
            )
        except Exception as e:
            print("Email sending failed:", e)

        return Response({'key': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'key': token.key}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me_view(request):
    if request.method == 'GET':
        serializer = CustomUserProfileSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CustomUserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    if new_password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({'success': 'Password updated successfully'})



@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message_view(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        contact_message = serializer.save()

        user_email = serializer.validated_data.get('email')
        user_name = serializer.validated_data.get('name')
        user_message = serializer.validated_data.get('message')
        user_subject = "Thank You for Contacting Us!"

        # Render beautiful HTML email to user
        html_message = render_to_string('emails/contact_thankyou.html', {
            'user_name': user_name,
            'user_message': user_message,
        })
        plain_message = strip_tags(html_message)

        send_mail(
            user_subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user_email],
            html_message=html_message,
            fail_silently=False,
        )

        # Beautiful HTML admin notification for contact message
        admin_html = render_to_string('emails/admin_contact_message.html', {
            'user_name': user_name,
            'user_email': user_email,
            'user_message': user_message,
        })
        admin_plain = strip_tags(admin_html)
        admin_subject = f"📩 New Contact Message from {user_name}"

        admin_email = settings.DEFAULT_FROM_EMAIL  # Or specify another admin email
        send_mail(
            admin_subject,
            admin_plain,
            settings.DEFAULT_FROM_EMAIL,
            [admin_email],
            html_message=admin_html,
            fail_silently=False,
        )

        return Response({'message': 'Your message has been sent successfully.'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
