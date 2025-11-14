from rest_framework import serializers
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        # List all the fields from your model you want in the API
        fields = ['id', 'make', 'model', 'year', 'price']