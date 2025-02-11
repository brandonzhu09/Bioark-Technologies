from django.urls import path
from . import views

urlpatterns = [
    path('example-view/', views.example_view),
    path('view-order/<str:payment_token>', views.view_order),
    path('view-orders/', views.view_orders),
    path('view-cloning-crispr-orders/', views.view_cloning_crispr_orders),
    path('view-cloning-overexpression-orders/', views.view_cloning_overexpression_orders),
    path('view-cloning-rnai-orders/', views.view_cloning_rnai_orders),
    path('view-user-info/', views.view_user_info),
    path('update-user-info/', views.update_user_info),
    path('get-user-email/', views.get_user_email),
    path('reset-user-email/', views.reset_user_email),
    path('reset-user-password/', views.reset_user_password),
]