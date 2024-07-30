from django.db import models


class Promoter(models.Model):
    promoter_id = models.AutoField(primary_key=True)
    promoter_name = models.CharField()
    promoter_code = models.CharField()

class PromoterSpecialCase(models.Model):
    promoter_id = models.AutoField(primary_key=True)
    promoter_name = models.CharField()
    promoter_code = models.CharField()
    function_type = models.CharField()
    delivery_type = models.CharField()

class Property(models.Model):
    property_id = models.AutoField(primary_key=True)
    property_name = models.CharField()
    property_code = models.CharField()

class ProteinTag(models.Model):
    protein_tag_id = models.AutoField(primary_key=True)
    protein_tag_name = models.CharField()
    protein_tag_code = models.CharField()

class FluoresceneMarker(models.Model):
    fluorescene_marker_id = models.AutoField(primary_key=True)
    fluorescene_marker_name = models.CharField()
    fluorescene_marker_code = models.CharField()

class SelectionMarker(models.Model):
    selection_marker_id = models.AutoField(primary_key=True)
    selection_marker_name = models.CharField()
    selection_marker_code = models.CharField()

class BacterialMarker(models.Model):
    bacterial_marker_id = models.AutoField(primary_key=True)
    bacterial_marker_name = models.CharField()
    bacterial_marker_code = models.CharField()

class BacterialMarkerSpecialCase(models.Model):
    bacterial_marker_id = models.AutoField(primary_key=True)
    bacterial_marker_name = models.CharField()
    bacterial_marker_code = models.CharField()
    function_type = models.CharField()
    delivery_type = models.CharField()

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


class ProductInventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    units_in_stock = models.IntegerField()
    units_on_order = models.IntegerField()
    loaded = models.BooleanField()
    currency = models.CharField()
    manufacturer = models.CharField()


class ProductCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField()
    description = models.CharField()


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_sku = models.CharField()
    product_name = models.CharField()
    function_type = models.CharField()
    structure_type = models.CharField()
    delivery_type = models.CharField()
    promoter_name = models.CharField()
    property_name = models.CharField()
    protein_tag_name = models.CharField()
    fluorescene_marker_name = models.CharField()
    selection_marker_name = models.CharField()
    bacterial_marker_name = models.CharField()
    delivery_format = models.CharField()
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    adjusted_price = models.DecimalField(max_digits=8, decimal_places=2)
    unit_weight = models.DecimalField(max_digits=8, decimal_places=2)
    inventory = models.ForeignKey(ProductInventory, on_delete=models.PROTECT)
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT)
    gene = models.ForeignKey(Gene, null=True, on_delete=models.PROTECT)
