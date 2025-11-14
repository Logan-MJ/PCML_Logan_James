from django.shortcuts import render

from django.http import JsonResponse

def hello(request):
    return JsonResponse({"message": "Hello from Django!"})


from rest_framework import generics
from .models import Car
from .serializers import CarSerializer

class CarListCreateView(generics.ListCreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer