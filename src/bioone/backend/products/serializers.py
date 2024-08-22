from rest_framework import serializers
from products.models import *


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['category_id', 'category_name']

class FunctionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FunctionType
        fields = ['function_type_id', 'symbol', 'function_type_name', 'description']

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
            'delivery_format_name': DeliveryFormat.objects.get(delivery_format_symbol=instance.delivery_format_code).delivery_format_name,
            'product_format_description': DeliveryFormat.objects.get(delivery_format_symbol=instance.delivery_format_code).description,
            'product_name': instance.product_name,
            'quantity': instance.amount + " " + instance.unit_size,
            'price': instance.base_price,
        }

class ProductSerializer(serializers.ModelSerializer):
    function_type_name = serializers.SerializerMethodField()
    delivery_type_name = serializers.SerializerMethodField()
    promoter_name = serializers.SerializerMethodField()
    protein_tag_name = serializers.SerializerMethodField()
    fluorescene_marker_name = serializers.SerializerMethodField()
    selection_marker_name = serializers.SerializerMethodField()
    bacterial_marker_name = serializers.SerializerMethodField()
    delivery_format_name = serializers.SerializerMethodField()
    target_sequence = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['product_id', 'product_sku', 'product_name', 'description', 'function_type_name', 'delivery_type_name', 'promoter_name', 'protein_tag_name', 'fluorescene_marker_name', 'selection_marker_name', 'bacterial_marker_name', 'delivery_format_name', 'target_sequence']
    
    def get_function_type_name(self, product):
        try:
            function_type = FunctionType.objects.filter(symbol=product.function_type_code).first()
            return function_type.function_type_name
        except FunctionType.DoesNotExist:
            return None

    def get_delivery_type_name(self, product):
        try:
            delivery_type = DeliveryLibrary.objects.filter(delivery_type_symbol=product.delivery_type_code).first()
            return delivery_type.delivery_type_name
        except DeliveryLibrary.DoesNotExist:
            return None
    
    def get_promoter_name(self, product):
        try:
            promoter_queryset = Promoter.objects.filter(promoter_code=product.promoter_code).values("promoter_name")
            promoter_special_case_queryset = PromoterSpecialCase.objects.filter(promoter_code=product.promoter_code).values("promoter_name")
            promoter = promoter_queryset.union(promoter_special_case_queryset)[0]
            return promoter['promoter_name']
        except Exception:
            return None
    
    def get_protein_tag_name(self, product):
        try:
            protein_tag = ProteinTag.objects.filter(protein_tag_code=product.protein_tag_code).first()
            return protein_tag.protein_tag_name
        except ProteinTag.DoesNotExist:
            return None
    
    def get_fluorescene_marker_name(self, product):
        try:
            fluorescene_marker = FluoresceneMarker.objects.filter(fluorescene_marker_code=product.fluorescene_marker_code).first()
            return fluorescene_marker.fluorescene_marker_name
        except FluoresceneMarker.DoesNotExist:
            return None
    
    def get_selection_marker_name(self, product):
        try:
            selection_marker = SelectionMarker.objects.filter(selection_marker_code=product.selection_marker_code).first()
            return selection_marker.selection_marker_name
        except SelectionMarker.DoesNotExist:
            return None
    
    def get_bacterial_marker_name(self, product):
        try:
            bacterial_marker_queryset = BacterialMarker.objects.filter(bacterial_marker_code=product.bacterial_marker_code).values("bacterial_marker_name")
            bacterial_marker_special_case_queryset = BacterialMarkerSpecialCase.objects.filter(bacterial_marker_code=product.bacterial_marker_code).values("bacterial_marker_name")
            bacterial_marker = bacterial_marker_queryset.union(bacterial_marker_special_case_queryset)[0]
            return bacterial_marker['bacterial_marker_name']
        except Exception:
            return None
    
    def get_delivery_format_name(self, product):
        try:
            delivery_format = DeliveryLibrary.objects.filter(delivery_format_symbol=product.delivery_format_code).first()
            return delivery_format.delivery_format_name
        except DeliveryLibrary.DoesNotExist:
            return None

    def get_target_sequence(self, product):
        try:
            if product.gene_id:
                gene = GeneLibrary.objects.get(gene_library_id=product.gene_id)
                return gene.target_sequence
            return None
        except GeneLibrary.DoesNotExist:
            return None
