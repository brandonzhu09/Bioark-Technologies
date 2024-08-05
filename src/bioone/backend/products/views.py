from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from products.models import *
from products.serializers import *

# Create your views here.
@api_view(['GET'])
def get_product_categories(request):
    queryset = ProductCategory.objects.all()
    serializer = ProductCategorySerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_function_types_by_category(request):
    category_id = request.GET["category_id"]
    queryset = FunctionType.objects.filter(category_id=category_id)
    serializer = FunctionCategorySerializer(queryset, many=True)
    return Response(serializer.data)
