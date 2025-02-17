from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'product_sku', 'product_name', 'base_price', 'unit_size', 'ready_status')

@admin.register(ProductInventory)
class ProductInventory(admin.ModelAdmin):
    list_display = ('inventory_id', 'units_in_stock', 'units_on_order', 'loaded', 'currency', 'manufacturer')

@admin.register(DeliveryLibrary)
class DeliveryLibrary(admin.ModelAdmin):
    list_display = ('delivery_library_id', 'structure_type_symbol', 'delivery_format_symbol', 'function_type')