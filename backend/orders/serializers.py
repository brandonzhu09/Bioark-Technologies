from rest_framework import serializers
from orders.models import CartItem

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product_sku', 'product_name', 'price', 'adjusted_price', 'unit_size', 'quantity', 'discount_code']
