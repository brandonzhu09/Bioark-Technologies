from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist


from orders.models import *
from orders.serializers import OrderItemSerializer
from users.serializers import UserSerializer

# Create your views here.
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def example_view(request):
    content = {
        'user': str(request.user),  # `django.contrib.auth.User` instance.
        'auth': str(request.auth),  # None
    }
    return Response(content)

@api_view(['GET'])
def view_orders(request):
    orders = Order.objects.filter(user_id=request.user.id)
    order_items = OrderItem.objects.filter(order_id__in=orders)
    serializer = OrderItemSerializer(order_items, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def view_cloning_crispr_orders(request):
    orders = Order.objects.filter(user_id=request.user.id)
    order_items = OrderItem.objects.filter(order_id__in=orders, order_class='Cloning-CRISPR').order_by('-order_placed_date')
    serializer = OrderItemSerializer(order_items, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def view_cloning_overexpression_orders(request):
    orders = Order.objects.filter(user_id=request.user.id)
    order_items = OrderItem.objects.filter(order_id__in=orders, order_class='Cloning-Overexpression').order_by('-order_placed_date')
    serializer = OrderItemSerializer(order_items, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def view_cloning_rnai_orders(request):
    orders = Order.objects.filter(user_id=request.user.id)
    order_items = OrderItem.objects.filter(order_id__in=orders, order_class='Cloning-RNAi').order_by('-order_placed_date')
    serializer = OrderItemSerializer(order_items, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def view_user_info(request):
    user = User.objects.get(id=request.user.id)
    serializer = UserSerializer(user)

    return Response(serializer.data)

@api_view(['POST'])
def update_user_info(request):
    try:
        user = User.objects.get(id=request.user.id)
        data = request.data
        
        user.first_name = data.get('firstName')
        user.last_name = data.get('lastName')
        user.institution = data.get('institution')
        user.shipping_address.address_line_1 = data.get('address')
        user.shipping_address.city = data.get('city')
        user.shipping_address.state = data.get('state')
        user.shipping_address.zipcode = data.get('zipcode')

        user.save()

        return Response({"success": True})

        
    except ObjectDoesNotExist:
            # Handle the case where the user ID does not exist
            return Response(
                {"error": "User does not exist"},
                status=404
            )