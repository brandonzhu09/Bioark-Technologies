from rest_framework import serializers
from products.models import *


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['category_id', 'category_name']

class FunctionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FunctionType
        fields = ['function_type_id', 'symbol', 'function_type_name']

class DeliveryLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryLibrary
        fields = ['delivery_type_symbol', 'delivery_type_name', 'delivery_format_symbol', 'delivery_format_name']

class GeneLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneLibrary
        fields = ['target_sequence', 'symbol', 'gene_name', 'locus_id']

class DeliveryFormatTableSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        return {
            'product_id': instance.product_id,
            'delivery_format_name': DeliveryLibrary.objects.filter(delivery_format_symbol=instance.delivery_format_code).first().delivery_format_name,
            'product_format_description': instance.product_format_description,
            'product_name': instance.product_name,
            'quantity': instance.amount + " " + instance.unit_size,
            'price': instance.base_price,
        }
