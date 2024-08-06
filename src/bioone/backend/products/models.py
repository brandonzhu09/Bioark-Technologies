from django.db import models


class Promoter(models.Model):
    promoter_id = models.AutoField(primary_key=True)
    promoter_name = models.CharField()
    promoter_code = models.CharField()

    class Meta:
        db_table = 'promoter'

class PromoterSpecialCase(models.Model):
    promoter_id = models.AutoField(primary_key=True)
    promoter_name = models.CharField()
    promoter_code = models.CharField()
    function_type = models.CharField()
    delivery_type = models.CharField()

    class Meta:
        db_table = 'promoter_special_case'


class Property(models.Model):
    property_id = models.AutoField(primary_key=True)
    property_name = models.CharField()
    property_code = models.CharField()

    class Meta:
        db_table = 'property'


class ProteinTag(models.Model):
    protein_tag_id = models.AutoField(primary_key=True)
    protein_tag_name = models.CharField()
    protein_tag_code = models.CharField()

    class Meta:
        db_table = 'protein_tag'


class FluoresceneMarker(models.Model):
    fluorescene_marker_id = models.AutoField(primary_key=True)
    fluorescene_marker_name = models.CharField()
    fluorescene_marker_code = models.CharField()

    class Meta:
        db_table = 'fluorescene_marker'


class SelectionMarker(models.Model):
    selection_marker_id = models.AutoField(primary_key=True)
    selection_marker_name = models.CharField()
    selection_marker_code = models.CharField()

    class Meta:
        db_table = 'selection_marker'


class BacterialMarker(models.Model):
    bacterial_marker_id = models.AutoField(primary_key=True)
    bacterial_marker_name = models.CharField()
    bacterial_marker_code = models.CharField()

    class Meta:
        db_table = 'bacterial_marker'


class BacterialMarkerSpecialCase(models.Model):
    bacterial_marker_id = models.AutoField(primary_key=True)
    bacterial_marker_name = models.CharField()
    bacterial_marker_code = models.CharField()
    function_type = models.CharField()
    delivery_type = models.CharField()

    class Meta:
        db_table = 'bacterial_marker_special_case'


class Gene(models.Model):
    gene_id = models.AutoField(primary_key=True)
    gene_number = models.IntegerField()
    gene_name = models.CharField()
    symbol = models.CharField()
    locus_id = models.IntegerField()
    species = models.CharField()
    description = models.CharField()
    target_sequence = models.CharField()
    reference_link = models.CharField()

    class Meta:
        db_table = 'gene'


class ProductInventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    units_in_stock = models.IntegerField()
    units_on_order = models.IntegerField()
    loaded = models.BooleanField()
    currency = models.CharField()
    manufacturer = models.CharField()

    class Meta:
        db_table = 'product_inventory'


class ProductCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(unique=True)
    description = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'product_category'

class FunctionType(models.Model):
    function_type_id = models.AutoField(primary_key=True)
    symbol = models.CharField(unique=True) # TODO: enum
    function_type_name = models.CharField(unique=True)
    description = models.CharField(blank=True, null=True)
    load_status = models.CharField(blank=True, null=True, default="Loaded")
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT)

    class Meta:
        db_table = 'function_type'

# class DeliveryType(models.Model):
#     delivery_type_id = models.AutoField(primary_key=True)
#     code = models.CharField(unique=True) # TODO: enum
#     code_name = models.CharField(unique=True)

class DeliveryLibrary(models.Model):
    delivery_library_id = models.AutoField(primary_key=True)
    delivery_type_symbol = models.CharField()
    delivery_type_name = models.CharField()
    delivery_format_symbol = models.CharField()
    delivery_format_name = models.CharField()
    function_type = models.ForeignKey(FunctionType, on_delete=models.PROTECT)

    class Meta:
        db_table = 'delivery_library'


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_sku = models.CharField()
    product_name = models.CharField()
    function_category = models.CharField()
    function_type_code = models.CharField()
    delivery_type_code = models.CharField()
    serial_id = models.CharField()
    promoter_code = models.CharField()
    property_code = models.CharField()
    protein_tag_code = models.CharField()
    fluorescene_marker_code = models.CharField()
    selection_marker_code = models.CharField()
    bacterial_marker_code = models.CharField()
    delivery_format = models.CharField()
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    adjusted_price = models.DecimalField(max_digits=8, decimal_places=2)
    unit_weight = models.DecimalField(max_digits=8, decimal_places=2)
    load_status = models.CharField(blank=True, null=True, default="Loaded")
    inventory = models.ForeignKey(ProductInventory, on_delete=models.PROTECT)
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT)
    gene = models.ForeignKey(Gene, null=True, on_delete=models.PROTECT)

    class Meta:
        db_table = 'product'
