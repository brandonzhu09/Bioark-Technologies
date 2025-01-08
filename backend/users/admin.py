from django.contrib import admin
from .models import *
from django.contrib.sessions.models import Session


# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'job_title', 'company', 'mobile', 'telephone',
                    'address', 'billing_address', 'shipping_address')


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('session_key', 'expire_date', 'username', 'session_data')

    def session_data(self, obj):
        return obj.get_decoded()

    def username(self, obj):
        decoded_data = obj.get_decoded()
        user_id = decoded_data.get('_auth_user_id', None)
        user = User.objects.get(id=user_id)
        return user.username
