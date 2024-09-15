from django.urls import path
from . import views

urlpatterns = [
    path('example-view/', views.example_view),
]