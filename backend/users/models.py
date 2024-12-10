from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Address(models.Model):
    address_line_1 = models.CharField()
    address_line_2 = models.CharField(null=True)
    city = models.CharField()
    state = models.CharField()
    country = models.CharField()
    zipcode = models.CharField()

    class Meta:
        db_table = 'addresses'
    
    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state} {self.zipcode}"


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    title = models.CharField()
    mobile = models.CharField()
    telephone = models.CharField()
    company = models.CharField()
    job_title = models.CharField()
    address = models.ForeignKey(Address, related_name='address', on_delete=models.PROTECT, null=True)
    billing_address = models.ForeignKey(Address, related_name='billing_address', on_delete=models.PROTECT, null=True)
    shipping_address = models.ForeignKey(Address, related_name='shipping_address', on_delete=models.PROTECT, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
