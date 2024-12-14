import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.decorators import api_view


from users.models import User


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
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
        login(request, user)
        return JsonResponse({'detail': 'Successfully signed up.', 'success': True})
    except:
        return JsonResponse({'error': 'Email already exists'}, status=400)


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('email')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

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

# @require_POST
@api_view(['POST'])
def verify_email(request):
    # send_mail(
    #     'Verify your email',
    #     f'Click here to verify your email and activate your account: ',
    #     settings.EMAIL_HOST_USER,
    #     ['brandoncomputerplant@gmail.com'],
    # )

    return JsonResponse({'status': 'Email sent.'})
    
