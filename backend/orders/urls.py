from django.urls import path

from . import views
from orders.views import CartAPI

urlpatterns = [
    path('create/', views.create_order, name='create'),
    path('capture/<str:order_id>', views.capture_order, name='capture'),
    path('cart/', CartAPI.as_view(), name='cart'),
]