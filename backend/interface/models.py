from django.db import models

# Create your models here.
class ProductMode(models.Model):
    url = models.CharField()
    title = models.CharField(max_length=60)
    content = models.TextField()

    class Meta:
        db_table = 'product_mode'

class ServiceMode(models.Model):
    url = models.CharField()
    title = models.CharField(max_length=60)
    content = models.TextField()

    class Meta:
        db_table = 'service_mode'
