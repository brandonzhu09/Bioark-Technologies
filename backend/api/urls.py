from django.urls import path, include

from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('signup/', views.signup_view, name='api-signup'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    path('verify-email/<str:token>/', views.verify_email, name='verify_email'),
]