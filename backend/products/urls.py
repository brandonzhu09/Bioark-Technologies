from django.urls import path
from . import views

urlpatterns = [
    path('load-product-categories/', views.load_product_categories),
    path('get-function-types-by-category/', views.get_function_types_by_category),
    path('get-structure-types-by-function-type/', views.get_structure_types_by_function_type),
    path('get-code-p-parameters/', views.get_code_p_parameters),
    path('get-gene-table-by-symbol/', views.get_gene_table_by_symbol),
    path('get-delivery-format-table/', views.get_delivery_format_table),
]