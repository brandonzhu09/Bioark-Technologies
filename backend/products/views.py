from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from orders.serializers import OrderItemSerializer
from products.models import *
from products.serializers import *
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from orders.models import OrderItem

# Create your views here.
@api_view(['GET'])
def load_product_categories(request):
    # if request.user.is_authenticated:
    queryset = ProductCategory.objects.all()
    serializer = ProductCategorySerializer(queryset, many=True)
    return Response(serializer.data)
    
    # return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_function_types_by_category(request):
    category_id = request.GET["category_id"]
    queryset = FunctionType.objects.filter(category_id=category_id)
    serializer = FunctionCategorySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_structure_types_by_function_type(request):
    function_type_id = request.GET["function_type_id"]
    structure_types = DeliveryLibrary.objects.filter(function_type_id=function_type_id).values("structure_type_symbol").distinct()
    queryset = StructureType.objects.filter(structure_type_symbol__in=structure_types).values("structure_type_symbol", "structure_type_name")

    return Response(list(queryset))


@api_view(['GET'])
def get_code_p_parameters(request):
    function_type_id = request.GET["function_type_id"]
    structure_type_symbol = request.GET["structure_type_symbol"]
    # TODO: perform correlation check with function and structure type
    # get function type symbol
    function_type_symbol = FunctionType.objects.get(function_type_id=function_type_id).function_type_symbol

    data = {
        "promoters": get_promoters(function_type_symbol, structure_type_symbol),
        "protein_tags": get_protein_tags(),
        "fluorescene_markers": get_fluorescene_markers(),
        "selection_markers": get_selection_markers(),
        "bacterial_markers": get_bacterial_markers(structure_type_symbol),
    }
    return Response(data)


@api_view(['GET'])
def get_gene_table_by_symbol(request):
    symbol = request.GET["symbol"]
    symbol = symbol.upper()
    queryset = GeneLibrary.objects.filter(symbol__contains=symbol)[:10]
    serializer = GeneLibrarySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_delivery_format_table(request):
    structure_type_name = request.GET["structure_type_name"]
    function_type_name = request.GET["function_type_name"]
    promoter_name = request.GET["promoter_name"]
    protein_tag_name = request.GET["protein_tag_name"]
    fluorescene_marker_name = request.GET["fluorescene_marker_name"]
    selection_marker_name = request.GET["selection_marker_name"]
    bacterial_marker_name = request.GET["bacterial_marker_name"]
    target_sequence = request.GET["target_sequence"]

    structure_type_symbol = StructureType.objects.get(structure_type_name=structure_type_name).structure_type_symbol
    delivery_format_codes = DeliveryLibrary.objects.filter(structure_type_symbol=structure_type_symbol).distinct().values("delivery_format_symbol")
    promoter_queryset = Promoter.objects.filter(promoter_name=promoter_name).values("promoter_code")
    promoter_special_case_queryset = PromoterSpecialCase.objects.filter(promoter_name=promoter_name).values("promoter_code")
    promoter_code = promoter_queryset.union(promoter_special_case_queryset)[0]['promoter_code']

    bacterial_marker_queryset = BacterialMarker.objects.filter(bacterial_marker_name=bacterial_marker_name).values("bacterial_marker_code")
    bacterial_marker_special_case_queryset = BacterialMarkerSpecialCase.objects.filter(bacterial_marker_name=bacterial_marker_name).values("bacterial_marker_code")
    bacterial_marker_code = bacterial_marker_queryset.union(bacterial_marker_special_case_queryset)[0]['bacterial_marker_code']

    products = Product.objects.filter(delivery_format_code__in=delivery_format_codes,
                                      function_type_code=FunctionType.objects.get(function_type_name=function_type_name).function_type_symbol,
                                      promoter_code=promoter_code,
                                      protein_tag_code=ProteinTag.objects.get(protein_tag_name=protein_tag_name).protein_tag_code,
                                      fluorescene_marker_code=FluoresceneMarker.objects.get(fluorescene_marker_name=fluorescene_marker_name).fluorescene_marker_code,
                                      selection_marker_code=SelectionMarker.objects.get(selection_marker_name=selection_marker_name).selection_marker_code,
                                      bacterial_marker_code=bacterial_marker_code,
                                      gene=GeneLibrary.objects.get(target_sequence=target_sequence),
                                      ).distinct()
    
    structure_type_code = 'Others'
    ready_status = 'Not'
    # check whether structure type is M or B
    if structure_type_name == 'Lenti-AIO':
        structure_type_code = 'M'
    if structure_type_name == 'AAV-AIO':
        structure_type_code = 'B'
    # check whether product is on-shelf or custom made
    if len(products) > 0:
        ready_status = 'Yes'

    design_products = DesignLibrary.objects.filter(delivery_format_code__in=delivery_format_codes,
                                                   structure_type_code=structure_type_code,
                                                   ready_status=ready_status)
    
    data = {}
    product_id = 0

    for instance in design_products:
        delivery_format_name = DeliveryFormat.objects.get(delivery_format_symbol=instance.delivery_format_code).delivery_format_name
        product = {
            'product_id': product_id,
            'product_sku': generate_product_sku(function_type_name, structure_type_name, promoter_name,
                                                protein_tag_name, fluorescene_marker_name, selection_marker_name,
                                                bacterial_marker_name, target_sequence, delivery_format_name),
            'product_name': "Test",
            'delivery_format_name': delivery_format_name,
            'product_format_description': DeliveryFormat.objects.get(delivery_format_symbol=instance.delivery_format_code).description,
            'quantity': instance.amount + " " + instance.unit_size,
            'price': instance.base_price,
            'adjusted_price': instance.adjusted_price,
            'ready_status': ready_status
        }
        if delivery_format_name not in data:
            data[delivery_format_name] = [product]
        else:
            data[delivery_format_name].append(product)

        product_id += 1

    # serializer = DeliveryFormatTableSerializer(design_products, many=True)    

    return Response(data)

@api_view(['GET'])
def get_product_summary(request, product_sku):
    data = decode_product_sku(product_sku)
    return Response(data)

@api_view(['GET'])
def get_product_sku(request):
    function_type_name = request.GET["function_type_name"]
    structure_type_name = request.GET["structure_type_name"]
    promoter_name = request.GET["promoter_name"]
    protein_tag_name = request.GET["protein_tag_name"]
    fluorescene_marker_name = request.GET["fluorescene_marker_name"]
    selection_marker_name = request.GET["selection_marker_name"]
    bacterial_marker_name = request.GET["bacterial_marker_name"]
    target_sequence = request.GET["target_sequence"]
    delivery_format_name = request.GET.get("delivery_format_name")

    product_sku = generate_product_sku(function_type_name, structure_type_name, promoter_name, protein_tag_name, fluorescene_marker_name, selection_marker_name,
                                       bacterial_marker_name, target_sequence, delivery_format_name)
    
    return Response({"product_sku": product_sku})


def generate_product_sku(function_type_name, structure_type_name, promoter_name, protein_tag_name, fluorescene_marker_name, selection_marker_name,
                         bacterial_marker_name, target_sequence, delivery_format_name=None):
    function_type_code = FunctionType.objects.get(function_type_name=function_type_name).function_type_symbol
    structure_type_code = StructureType.objects.get(structure_type_name=structure_type_name).structure_type_symbol
    # Promoter code - check special case
    promoter_queryset = Promoter.objects.filter(promoter_name=promoter_name).values("promoter_code")
    promoter_special_case_queryset = PromoterSpecialCase.objects.filter(promoter_name=promoter_name).values("promoter_code")
    promoter_code = promoter_queryset.union(promoter_special_case_queryset)[0]['promoter_code']
    # Bacterial Marker code - check special case
    bacterial_marker_queryset = BacterialMarker.objects.filter(bacterial_marker_name=bacterial_marker_name).values("bacterial_marker_code")
    bacterial_marker_special_case_queryset = BacterialMarkerSpecialCase.objects.filter(bacterial_marker_name=bacterial_marker_name).values("bacterial_marker_code")
    bacterial_marker_code = bacterial_marker_queryset.union(bacterial_marker_special_case_queryset)[0]['bacterial_marker_code']

    protein_tag_code = ProteinTag.objects.get(protein_tag_name=protein_tag_name).protein_tag_code
    fluorescene_marker_code = FluoresceneMarker.objects.get(fluorescene_marker_name=fluorescene_marker_name).fluorescene_marker_code
    selection_marker_code = SelectionMarker.objects.get(selection_marker_name=selection_marker_name).selection_marker_code
    
    if delivery_format_name:
        delivery_format_code = DeliveryFormat.objects.get(delivery_format_name=delivery_format_name).delivery_format_symbol
    else:
        delivery_format_code = ""

    product_sku = function_type_code + structure_type_code + "-" + promoter_code + protein_tag_code + fluorescene_marker_code + selection_marker_code + bacterial_marker_code + "-" + target_sequence + delivery_format_code

    return product_sku

def decode_product_sku(product_sku):
    try:
        # Split the SKU into parts
        part1, part2, target_sequence_with_delivery = product_sku.split("-")
        function_type_code = part1[:2]
        structure_type_code = part1[2:]
        
        promoter_code = part2[0]
        protein_tag_code = part2[1]
        fluorescene_marker_code = part2[2]
        selection_marker_code = part2[3]
        bacterial_marker_code = part2[4]
        
        target_sequence = target_sequence_with_delivery[:6]
        delivery_format_code = target_sequence_with_delivery[-1]
        
        # Retrieve data from the database
        function_type_name = FunctionType.objects.get(function_type_symbol=function_type_code).function_type_name
        structure_type_name = StructureType.objects.get(structure_type_symbol=structure_type_code).structure_type_name

        promoter = Promoter.objects.filter(promoter_code=promoter_code).first()
        if promoter:
            promoter_name = promoter.promoter_name
        else:
            promoter_special_case = PromoterSpecialCase.objects.filter(promoter_code=promoter_code).first()
            promoter_name = promoter_special_case.promoter_name if promoter_special_case else None

        bacterial_marker = BacterialMarker.objects.filter(bacterial_marker_code=bacterial_marker_code).first()
        if bacterial_marker:
            bacterial_marker_name = bacterial_marker.bacterial_marker_name
        else:
            bacterial_marker_special_case = BacterialMarkerSpecialCase.objects.filter(bacterial_marker_code=bacterial_marker_code).first()
            bacterial_marker_name = bacterial_marker_special_case.bacterial_marker_name if bacterial_marker_special_case else None

        protein_tag_name = ProteinTag.objects.get(protein_tag_code=protein_tag_code).protein_tag_name
        fluorescene_marker_name = FluoresceneMarker.objects.get(fluorescene_marker_code=fluorescene_marker_code).fluorescene_marker_name
        selection_marker_name = SelectionMarker.objects.get(selection_marker_code=selection_marker_code).selection_marker_name
        delivery_format_name = DeliveryFormat.objects.get(delivery_format_symbol=delivery_format_code).delivery_format_name

        # Return the decoded components as a dictionary
        return {
            "function_type_name": function_type_name,
            "structure_type_name": structure_type_name,
            "promoter_name": promoter_name,
            "protein_tag_name": protein_tag_name,
            "fluorescene_marker_name": fluorescene_marker_name,
            "selection_marker_name": selection_marker_name,
            "bacterial_marker_name": bacterial_marker_name,
            "target_sequence": target_sequence,
            "delivery_format_name": delivery_format_name,
        }
    
    except ObjectDoesNotExist as e:
        raise ValueError(f"Decoding failed: {str(e)}")
    except Exception as e:
        raise ValueError(f"Unexpected error during decoding: {str(e)}")


def get_promoters(function_type_symbol, structure_type_symbol):
    # check the special case for promoter options
    function_type_count = PromoterSpecialCase.objects.filter(function_type_symbol=function_type_symbol).count()
    if function_type_count > 0:
        queryset = PromoterSpecialCase.objects.filter(function_type_symbol=function_type_symbol).values("promoter_name", "promoter_code")
        return list(queryset)
    
    structure_type_count = PromoterSpecialCase.objects.filter(structure_type_symbol=structure_type_symbol).count()
    if structure_type_count > 0:
        queryset = PromoterSpecialCase.objects.filter(structure_type_symbol=structure_type_symbol).values("promoter_name", "promoter_code")
        return list(queryset)
    
    # return the default promoter options
    queryset = Promoter.objects.all().values("promoter_name", "promoter_code")
    return list(queryset)

def get_protein_tags():
    queryset = ProteinTag.objects.all().values("protein_tag_name", "protein_tag_code")
    return list(queryset)

def get_fluorescene_markers():
    queryset = FluoresceneMarker.objects.all().values("fluorescene_marker_name", "fluorescene_marker_code")
    return list(queryset)

def get_selection_markers():
    queryset = SelectionMarker.objects.all().values("selection_marker_name", "selection_marker_code")
    return list(queryset)

def get_bacterial_markers(structure_type_symbol):
    # check the special case for bacterial marker options
    queryset = BacterialMarkerSpecialCase.objects.filter(structure_type_symbol=structure_type_symbol).values("bacterial_marker_name", "bacterial_marker_code")
    if len(queryset) > 0:
        return list(queryset)
    queryset = BacterialMarker.objects.all().values("bacterial_marker_name", "bacterial_marker_code")
    return list(queryset)
