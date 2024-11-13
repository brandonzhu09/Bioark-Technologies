from django.contrib import admin
from .models import *

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'payment_token', 'total_price', 'quantity', 'shipping_address', 'order_placed_date',
                    'order_process_date', 'delivery_date', 'billing_date', 'fulfilled', 'paid', 'user')
    list_filter = ('order_placed_date', 'delivery_date')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order_item_id', 'order', 'product_sku', 'product_name', 'total_price', 'unit_size', 'quantity', 'fulfilled', 'discount_code', 'shipping_date', 'delivery_date', 'billing_date')
