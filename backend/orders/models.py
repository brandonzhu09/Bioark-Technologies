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
    order_placed_date = models.DateTimeField(default=datetime.now)
    order_process_date = models.DateTimeField()
    delivery_date = models.DateField()
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
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_code = models.CharField(null=True)
    shipping_date = models.DateField()
    delivery_date = models.DateField()
    billing_date = models.DateField()
    transaction_status = models.CharField(null=True)
    fulfilled = models.BooleanField(default=False)
    refunded = models.BooleanField(default=False)
    paid = models.BooleanField(null=True)
    order = models.ForeignKey(Order, on_delete=models.PROTECT)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)

    class Meta:
        db_table = 'order_item'

class Cart(object):
    def __init__(self, request):
        """
        Initialize the cart
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            # save an empty cart in session
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def save(self):
        self.session.modified = True

    def add(self, product, quantity=1, override_quantity=False):
        """
        Add product to the cart or update its quantity
        """
        product_id = str(product.product_id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                "quantity": 0,
                "price": str(product["price"])
            }
        if override_quantity:
            self.cart[product_id]["quantity"] = quantity
        else:
            self.cart[product_id]["quantity"] += quantity
        self.save()

    def remove(self, product):
        """
        Remove a product from the cart
        """
        product_id = str(product.product_id)

        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def __iter__(self):
        """
        Loop through cart items and fetch the products from the database
        """
        product_ids = self.cart.keys()
        products = Product.objects.filter(product_id__in=product_ids)
        cart = self.cart.copy()
        for product in products:
            cart[str(product.product_id)]["product"] = ProductSerializer(product).data
        for item in cart.values():
            item["price"] = Decimal(item["price"]) 
            item["total_price"] = item["price"] * item["quantity"]
            yield item

    def __len__(self):
        """
        Count all items in the cart
        """
        return sum(item["quantity"] for item in self.cart.values())

    def get_total_price(self):
        return sum(Decimal(item["price"]) * item["quantity"] for item in self.cart.values())

    def clear(self):
        # remove cart from session
        del self.session[settings.CART_SESSION_ID]
        self.save()
