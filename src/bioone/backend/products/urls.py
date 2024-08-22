from django.urls import path
from . import views

urlpatterns = [
    path('load-product-categories/', views.load_product_categories),
    path('get-function-types-by-category/', views.get_function_types_by_category),
    path('get-delivery-types-by-function-type/', views.get_delivery_types_by_function_type),
    path('get-code-p-by-function-delivery/', views.get_code_p_by_function_delivery),
    path('get-gene-table-by-symbol/', views.get_gene_table_by_symbol),
    path('get-delivery-format-table/', views.get_delivery_format_table),
    path('get-product-summary/', views.get_product_summary),
]