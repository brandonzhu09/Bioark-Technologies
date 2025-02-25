from django.contrib import admin
from .models import *
from import_export.admin import ImportExportActionModelAdmin
from import_export import resources


# Register your models here.
class ProductResource(resources.ModelResource):

    class Meta:
        model = Product
        import_id_fields = ('product_id',)

@admin.register(Product)
class ProductAdmin(ImportExportActionModelAdmin):
    resource_classes = [ProductResource]
    list_display = ('product_id', 'product_sku', 'product_name', 'base_price', 'unit_size', 'ready_status')

@admin.register(FeaturedProduct)
class FeaturedProductAdmin(admin.ModelAdmin):
    list_display = ('catalog_number', 'product_name', 'on_display', 'shelf_status', 'units_in_stock', 'union')
    ordering = ('on_display',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('union', 'name', 'image')

@admin.register(ManualFile)
class ManualFileAdmin(admin.ModelAdmin):
    list_display = ('union', 'name', 'manual')

@admin.register(UnitPrice)
class UnitPriceAdmin(admin.ModelAdmin):
    list_display = ('union', 'unit_size', 'price')

@admin.register(ProductInventory)
class ProductInventory(admin.ModelAdmin):
    list_display = ('inventory_id', 'units_in_stock', 'units_on_order', 'loaded', 'currency', 'manufacturer')

@admin.register(DeliveryLibrary)
class DeliveryLibrary(admin.ModelAdmin):
    list_display = ('delivery_library_id', 'structure_type_symbol', 'delivery_format_symbol', 'function_type')