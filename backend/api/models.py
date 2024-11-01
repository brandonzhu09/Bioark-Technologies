from django.db import models
from django.utils import timezone

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=30)
    author = models.CharField(max_length=30)
    body = models.CharField()
    date_posted = models.DateTimeField(default=timezone.now)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog'
