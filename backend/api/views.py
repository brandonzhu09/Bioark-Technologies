import json
import os

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response


from products.serializers import ProductSerializer
from users.models import User
from api.models import EmailVerificationToken
from products.models import Product

FRONTEND_DOMAIN = os.environ.get('FRONTEND_DOMAIN')

def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set', 'csrftoken': get_token(request)})
    return response

@require_POST
def signup_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')

    # Basic validation
    if not email:
        return JsonResponse({'detail': 'All fields are required'}, status=400)
    
    # Validate email format
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({'detail': 'Invalid email address.'}, status=400)
    
    # Create user
    try:
        # Check if a user with the given email already exists
        user = User.objects.filter(email=email).first()
        
        if user:
            # If the user exists and password is not provided, account has not been activated yet
            if not user.has_usable_password() and not password:
                return JsonResponse({'detail': 'The email you provided already exists in our system. Please verify your account has been activated.'}, status=400) 
            # If the user exists and password is provided, activate account
            elif not user.has_usable_password() and password:
                user.set_password(password)
                user.is_active = True
                user.save()
                return JsonResponse({'detail': 'Password successfully set.', 'success': True})
            else:
                return JsonResponse({'detail': 'An account already exists with this email. Try logging in.', 'success': False}, status=400)

        # create user account without password and send verification link
        elif not password:
            user = User(email=email)
            user.set_unusable_password()
            user.is_active = False
            user.save()
            send_verification_email(user)
            return JsonResponse({'detail': 'Verification email sent to activate account.'})

        else:
            # Create a new user
            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
            user.save()
            return JsonResponse({'detail': 'Successfully signed up.', 'success': True})
    except Exception as e:
        return JsonResponse({'detail': 'An error has occurred when processing your email. Try again.', 'error': e}, status=400)


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
    verification_url = f"{FRONTEND_DOMAIN}/verify-email/{token.token}/"
    send_mail(
        subject="Verify your email address",
        message=f"Click the link below to verify your email address:\n{verification_url}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
    )

@require_POST
def verify_email(request, token):
    verification_token = get_object_or_404(EmailVerificationToken, token=token)
    user = verification_token.user

    if verification_token.is_valid():
        verification_token.delete()

        if user.has_usable_password():
            # Activate account directly if password is already set
            user.is_active = True
            user.save()
            return JsonResponse({"status": "activated", "message": "Email verified successfully! You can now log in."})
        else:
            return JsonResponse({"status": "not_activated", "message": "Email verified successfully, redirecting to set password page.", "email": user.email})
    else:
        return JsonResponse({"status": "not_verified", "message": "Verification link expired or invalid."})

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
        from_email=email,
        recipient_list=["no-reply@bioarktech.com"],
    )

    return JsonResponse({"detail": "Contact form sent."})

@require_POST
def send_quote_form(request):
    data = json.loads(request.body)
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    gene_sequence = data.get('geneSequence')
    gene_species = data.get('geneSpecies')
    institution = data.get('institution')
    mammalian_cells = data.get('mammalianCells')
    plasmid_amount = data.get('plasmidAmount')
    product_type = data.get('productType')
    service_type = data.get('serviceType')
    cell_line_amount = data.get('cellLineAmount')
    message = data.get('message')
    
    email_message = ("New Quote Request from Bioark Tech\n"
                     "Customer Information:\n"
                     "-----------------------\n"
                     f"Name: {first_name} {last_name}\n"
                     f"Email: {email}\n")

    def add_field(label, value):
        return f"{label}: {value}\n" if value else ""

    email_message += add_field("Gene Sequence", gene_sequence)
    email_message += add_field("Gene Species", gene_species)
    email_message += add_field("Institution", institution)
    email_message += add_field("Mammalian Cells", mammalian_cells)
    email_message += add_field("Plasmid Amount", plasmid_amount)
    email_message += add_field("Product Type", product_type)
    email_message += add_field("Service Type", service_type)
    email_message += add_field("Cell Line Amount", cell_line_amount)

    if message:
        email_message += f"\nCustomer Message:\n-----------------------\n{message}\n"

    # Send the email
    send_mail(
        subject="New Quote from Bioark Tech",
        message=email_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[settings.EMAIL_HOST_USER],
    )

    return JsonResponse({"detail": "Contact form sent."})

@require_POST
def resend_verification(request):
    data = json.loads(request.body)
    email = data.get('email')

    # Check if the email exists
    user = User.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'detail': 'Email address not found.'}, status=404)

    # Check if the user is already verified
    if user.is_active and user.has_usable_password():
        return JsonResponse({'detail': 'Account already verified. Please log in.'}, status=400)

    send_verification_email(user)

    return JsonResponse({'detail': 'A new verification link has been sent to your email.'})

@api_view(['GET'])
def search_product(request):
    query = request.query_params.get('q', '')

    list_keywords = query.split()

    search_query = Q()
    for keyword in list_keywords:
        search_query |= Q(product_name__icontains=keyword)
        search_query |= Q(product_sku__icontains=keyword)
        search_query |= Q(description__icontains=keyword)

    products = Product.objects.filter(search_query)
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)