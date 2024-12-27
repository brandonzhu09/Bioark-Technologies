import json

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.decorators import api_view


from users.models import User
from api.models import EmailVerificationToken


def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response

@require_POST
def signup_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    # Basic validation
    if not password or not email:
        return JsonResponse({'error': 'All fields are required'}, status=400)

    # Create user
    try:
        user = User.objects.create_user(username=email, email=email, password=password, has_set_password=True)
        user.is_active = False
        user.save()
        send_verification_email(user)
        return JsonResponse({'detail': 'Successfully signed up.', 'success': True})
    except:
        return JsonResponse({'error': 'Email already exists'}, status=400)


@require_POST
def login_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return JsonResponse({'detail': 'Please provide email and password.'}, status=400)

    user = authenticate(email=email, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.', 'success': True})


@require_POST
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'username': request.user.username})


def send_verification_email(user):
    token, created = EmailVerificationToken.objects.get_or_create(user=user)
    verification_url = f"http://localhost:8000/api/verify-email/{token.token}/"
    send_mail(
        subject="Verify your email address",
        message=f"Click the link below to verify your email address:\n{verification_url}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
    )

def verify_email(request, token):
    verification_token = get_object_or_404(EmailVerificationToken, token=token)
    user = verification_token.user

    if verification_token.is_valid():
        verification_token.delete()

        if user.has_set_password:
            # Activate account directly if password is already set
            user.is_active = True
            user.save()
            return HttpResponse("Email verified successfully! You can now log in.")
        else:
            pass
            # Redirect to password creation page if not set
            # return redirect('set_password', user_id=user.id)
    else:
        return HttpResponse("Verification link expired or invalid.")

@require_POST
def send_contact_form(request):
    data = json.loads(request.body)
    subject = data.get('subject')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    phone = data.get('phone')
    message = data.get('message')
    
    send_mail(
        subject=f"New message from Bioark Tech: {subject}",
        message=f"Customer: {last_name}, {first_name}\nEmail: {email}\nPhone: {phone}\n{message}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[settings.EMAIL_HOST_USER],
    )

    return HttpResponse("Contact form sent.")
