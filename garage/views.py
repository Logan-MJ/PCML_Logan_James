from django.shortcuts import render
from django.http import JsonResponse
from .pagination import StandardResultsPagination

from rest_framework import generics, filters
from .models import Car
from .serializers import CarSerializer

def hello(request):
    return JsonResponse({"message": "Hello from Django!"})

class CarListCreateView(generics.ListCreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    pagination_class = StandardResultsPagination
    
    filter_backends = [filters.SearchFilter]
    
    search_fields = ['make', 'model', 'year']

class CarListView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year']