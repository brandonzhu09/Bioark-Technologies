from django.urls import path
from . import views

urlpatterns = [
    path('example-view/', views.example_view),
    path('view-orders/', views.view_orders),
]