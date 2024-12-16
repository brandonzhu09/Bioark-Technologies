from django.db import models
from django.utils import timezone

from users.models import User
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from datetime import timedelta

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=30)
    author = models.CharField(max_length=30)
    body = models.CharField()
    date_posted = models.DateTimeField(default=timezone.now)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog'

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return now() < self.created_at + timedelta(hours=24)  # Valid for 24 hours

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(64)
        super().save(*args, **kwargs)
