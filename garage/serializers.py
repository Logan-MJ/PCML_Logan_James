from rest_framework import serializers
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['id', 'make', 'model', 'year', 'price']

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for handling username/password input for API login.
    Used by the React frontend.
    """
    username = serializers.CharField(required=True)
    # Use write_only=True so the password is never sent back in the response
    password = serializers.CharField(required=True, write_only=True)