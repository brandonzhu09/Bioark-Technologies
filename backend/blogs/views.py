from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.shortcuts import render
from .models import Blog
from .serializers import BlogSerializer

# Create your views here.
@api_view(["GET"])
def get_blog(request, blog_id):
    blog = Blog.objects.get(id=blog_id)
    serializer = BlogSerializer(blog)
    return JsonResponse(serializer.data)
