from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

from orders.models import *
from orders.serializers import OrderItemSerializer

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
