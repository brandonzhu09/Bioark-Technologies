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
