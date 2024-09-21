from django.db import models
from datetime import datetime
from products.models import Product
from users.models import User, Address

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

