from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.create_order, name='create'),
    path('capture/<str:order_id>', views.capture_order, name='capture'),
]