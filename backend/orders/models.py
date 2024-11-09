from django.db import models
from datetime import datetime
from django.conf import settings
from products.models import Product
from products.serializers import ProductSerializer
from users.models import User, Address

from decimal import Decimal

# Create your models here.
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    payment_token = models.CharField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField()
    discount_code = models.CharField(null=True)
    order_placed_date = models.DateTimeField(default=datetime.now)
    order_process_date = models.DateTimeField(null=True)
    delivery_date = models.DateField()
    billing_date = models.DateField()
    shipping_address = models.ForeignKey(Address, on_delete=models.PROTECT)
    transaction_status = models.CharField(null=True)
    fulfilled = models.BooleanField(default=False)
    refunded = models.BooleanField(default=False)
    paid = models.BooleanField(null=True)
    notes = models.CharField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    class Meta:
        db_table = 'orders'


class OrderItem(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    shipping_date = models.DateField()
    delivery_date = models.DateField()
    billing_date = models.DateField()
    transaction_status = models.CharField(null=True)
    fulfilled = models.BooleanField(default=False)
    refunded = models.BooleanField(default=False)
    paid = models.BooleanField(null=True)
    product_sku = models.CharField(max_length=30)
    product_name = models.CharField(default="Product Name")
    unit_price = models.DecimalField(decimal_places=2, max_digits=10)
    total_price = models.DecimalField(decimal_places=2, max_digits=10)
    adjusted_price = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    unit_size = models.CharField()
    quantity = models.IntegerField(default=0)
    discount_code = models.CharField(max_length=20)
    order = models.ForeignKey(Order, on_delete=models.PROTECT)

    class Meta:
        db_table = 'order_item'

# class Cart(models.Model):
#     session_key = models.CharField(max_length=40, null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Cart {self.id}"

#     def get_total_price(self):
#         return sum(item.get_total_price() for item in self.items.all())

class CartItem(models.Model):
    session_key = models.CharField(max_length=40, null=True, blank=True)
    product_sku = models.CharField(max_length=30)
    product_name = models.CharField(default="Product Name")
    price = models.DecimalField(decimal_places=2, max_digits=10)
    adjusted_price = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    unit_size = models.CharField()
    quantity = models.IntegerField(default=0)
    discount_code = models.CharField(max_length=20)

    def get_total_price(self):
        return self.product.price * self.quantity

class Cart(object):
    def __init__(self, request):
        """
        Initialize the cart
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            # save an empty cart in session
            cart = self.session[settings.CART_SESSION_ID] = []
        self.cart = cart

    def save(self):
        self.session.modified = True

    def add(self, cart_item=None, quantity=1, override_quantity=False):
        """
        Add product to the cart or update its quantity
        """
        cart_item, created = CartItem.objects.get_or_create(session_key=self.session.session_key, product_sku=cart_item['product_sku'], product_name=cart_item['product_name'],
                                                            price=cart_item['price'], adjusted_price=cart_item['adjusted_price'], unit_size=cart_item['unit_size'])
        if created:
            self.cart.append(cart_item.id)
        
        if override_quantity:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
        
        cart_item.save()
        self.save()

    def remove(self, product_id):
        """
        Remove a product from the cart
        """
        if product_id in self.cart:
            self.cart.remove(product_id)
            self.save()
    
    def updateQuantity(self, product_id, quantity):
        """
        Remove a product from the cart
        """
        if product_id in self.cart:
            cart_item = CartItem.objects.get(id=product_id)
            cart_item.quantity = quantity
            cart_item.save()
            self.save()

    def __iter__(self):
        """
        Loop through cart items and fetch the products from the database
        """
        from orders.serializers import CartItemSerializer
        cart_items = CartItem.objects.filter(id__in=self.cart).order_by('-id')
        serializer = CartItemSerializer(cart_items, many=True)
        
        return serializer.data

    def __len__(self):
        """
        Count all items in the cart
        """
        return sum(CartItem.objects.get(id=item_id).quantity for item_id in self.cart)

    def get_total_price(self):
        return sum(CartItem.objects.get(id=item_id).price * CartItem.objects.get(id=item_id).quantity for item_id in self.cart)

    def clear(self):
        # remove cart from session
        del self.session[settings.CART_SESSION_ID]
        self.save()
