from django.urls import path
from . import views

urlpatterns = [
    path('product-categories/', views.get_product_categories),
    path('function-types-by-category/', views.get_function_types_by_category),
]