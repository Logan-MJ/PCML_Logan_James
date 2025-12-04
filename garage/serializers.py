from rest_framework import serializers
from .models import Car
from django.contrib.auth.models import User

class CarSerializer(serializers.ModelSerializer):
    dealership = serializers.StringRelatedField()
    class Meta:
        model = Car
        fields = ['id', 'make', 'model', 'year', 'price', 'dealership']

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for handling username/password input for API login.
    Used by the React frontend.
    """
    username = serializers.CharField(required=True)
    # Use write_only=True so the password is never sent back in the response
    password = serializers.CharField(required=True, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
        read_only_fields = ['username']