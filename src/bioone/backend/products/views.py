from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from products.models import *
from products.serializers import *

# Create your views here.
@api_view(['GET'])
def load_product_categories(request):
    queryset = ProductCategory.objects.all()
    serializer = ProductCategorySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_function_types_by_category(request):
    category_id = request.GET["category_id"]
    queryset = FunctionType.objects.filter(category_id=category_id)
    serializer = FunctionCategorySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_delivery_types_by_function_type(request):
    function_type_id = request.GET["function_type_id"]
    queryset = DeliveryLibrary.objects.filter(function_type_id=function_type_id).values("delivery_type_symbol", "delivery_type_name").distinct()
    return Response(list(queryset))


@api_view(['GET'])
def get_code_p_by_function_delivery(request):
    function_type_id = request.GET["function_type_id"]
    delivery_type_symbol = request.GET["delivery_type_symbol"]
    # TODO: perform correlation check with function and delivery type
    # get function type symbol
    function_type_symbol = FunctionType.objects.get(function_type_id=function_type_id).symbol

    data = {
        "promoters": get_promoters(function_type_symbol, delivery_type_symbol),
        "protein_tags": get_protein_tags(),
        "fluorescene_markers": get_fluorescene_markers(),
        "selection_markers": get_selection_markers(),
        "bacterial_markers": get_bacterial_markers(delivery_type_symbol),
    }
    return Response(data)


@api_view(['GET'])
def get_gene_table_by_symbol(request):
    symbol = request.GET["symbol"]
    queryset = GeneLibrary.objects.filter(symbol__contains=symbol)[:5]
    serializer = GeneLibrarySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def load_summary_resources(request):
    delivery_type_name = request.GET["delivery_type_name"]

    delivery_formats = list(DeliveryLibrary.objects.filter(delivery_type_name=delivery_type_name).distinct().values("delivery_format_name"))

    return Response(delivery_formats)


def get_promoters(function_type_symbol, delivery_type_symbol):
    # check the special case for promoter options
    function_type_count = PromoterSpecialCase.objects.filter(function_type_symbol=function_type_symbol).count()
    if function_type_count > 0:
        queryset = PromoterSpecialCase.objects.filter(function_type_symbol=function_type_symbol).values("promoter_name", "promoter_code")
        return list(queryset)
    
    delivery_type_count = PromoterSpecialCase.objects.filter(delivery_type_symbol=delivery_type_symbol).count()
    if delivery_type_count > 0:
        queryset = PromoterSpecialCase.objects.filter(delivery_type_symbol=delivery_type_symbol).values("promoter_name", "promoter_code")
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

def get_bacterial_markers(delivery_type_symbol):
    # check the special case for bacterial marker options
    queryset = BacterialMarkerSpecialCase.objects.filter(delivery_type_symbol=delivery_type_symbol).values("bacterial_marker_name", "bacterial_marker_code")
    if len(queryset) > 0:
        return list(queryset)
    queryset = BacterialMarker.objects.all().values("bacterial_marker_name", "bacterial_marker_code")
    return list(queryset)
