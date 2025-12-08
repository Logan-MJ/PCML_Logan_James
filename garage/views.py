from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission # New Import
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

# Assuming these imports exist in your project structure:
from .pagination import StandardResultsPagination 
from .models import Car, Profile
from .serializers import CarSerializer, UserLoginSerializer # UserLoginSerializer is new
from .serializers import UserSerializer

# --- HTML VIEWS (Protected Content) ---
    
@login_required
def garage_home(request):
    """
    Main dashboard view for the logged-in user's garage. 
    This is what the browser hits after successful login/redirect.
    """
    context = {
        'username': request.user.username,
    }
    return render(request, 'garage/home.html', context)

# --- API VIEWS (Authentication - For React Frontend) ---

@method_decorator(ensure_csrf_cookie, name='dispatch') 
class LoginAPIView(APIView):
    """
    Handles API login requests from the React frontend.
    On success, it establishes a session and sets the CSRF cookie.
    """
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user) 
                return Response(
                    {'message': 'Login successful', 'username': user.username}, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Invalid Credentials (Username or Password)'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    """
    Handles API logout requests from the React frontend.
    Destroys the current session.
    """
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        return Response({'message': 'Already logged out'}, status=status.HTTP_200_OK)

class AuthStatusAPIView(APIView):
    """
    Checks if the session is currently active.
    Returns 200 OK and username if logged in, 401 Unauthorized otherwise.
    """
    permission_classes = [IsAuthenticated] # Ensures only authenticated users can access

    def get(self, request):
        return Response({
            'message': 'Authenticated',
            'username': request.user.username,
        }, status=status.HTTP_200_OK)
    

# --- API VIEWS (Your Existing Car Endpoints) ---

class ProfileAPIView(APIView):
    """
    Retrieve or update the authenticated user's profile.
    Supports multipart/form-data for image uploads.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        user = request.user
        # Ensure profile exists
        profile, _ = Profile.objects.get_or_create(user=user)

        user_data = UserSerializer(user).data
        # Add profile-specific fields
        user_data['bio'] = profile.bio
        # Return absolute URL for the profile image so the React frontend can load it
        user_data['profile_image'] = request.build_absolute_uri(profile.image.url) if profile.image else None
        return Response(user_data)

    def put(self, request):
        user = request.user
        # Ensure Profile exists
        profile, _ = Profile.objects.get_or_create(user=user)

        # Update user fields via serializer
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Update profile fields (bio)
            bio = request.data.get('bio')
            if bio is not None:
                profile.bio = bio

            # Accept file uploads under 'image' or 'profile_picture'
            upload = None
            if 'image' in request.FILES:
                upload = request.FILES['image']
            elif 'profile_picture' in request.FILES:
                upload = request.FILES['profile_picture']

            if upload is not None:
                profile.image = upload

            profile.save()

            # Build response
            data = serializer.data
            data['bio'] = profile.bio
            # Return absolute URL for the profile image
            data['profile_image'] = request.build_absolute_uri(profile.image.url) if profile.image else None
            return Response(data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def about(request):
    """Simple informational page to demonstrate template inheritance and shared CSS."""
    return render(request, 'garage/about.html')

class CarListCreateView(generics.ListCreateAPIView):
    serializer_class = CarSerializer
    pagination_class = StandardResultsPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year']

    # Only authenticated users should be able to list/create cars
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Return cars belonging to dealerships owned by the current user
        return Car.objects.filter(dealership__owner=user)

    def perform_create(self, serializer):
        # Attach the new car to one of the current user's dealerships.
        # If the user has no dealership, create a default one.
        user = self.request.user
        from .models import Dealership
        dealership, _ = Dealership.objects.get_or_create(
            owner=user,
            defaults={"name": f"{user.username}'s Dealership"}
        )
        serializer.save(dealership=dealership)

class CarListView(generics.ListAPIView):
    # We no longer need 'queryset = Car.objects.all()' here because we override get_queryset()
    serializer_class = CarSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year']
    
    # 1. Require Authentication (Essential for accessing request.user)
    permission_classes = [IsAuthenticated] 
    
    # 2. Overriding the queryset to filter by user's dealerships
    def get_queryset(self):
        # The user object is available because of the IsAuthenticated permission class
        user = self.request.user
        
        # We need to filter cars where the dealership's owner is the current user.
        # Lookup Path: Car -> dealership (FK) -> owner (FK to User)
        return Car.objects.filter(dealership__owner=user)
        
    # 3. Add Pagination (Fixes your pagination issue, as discussed previously)
    pagination_class = StandardResultsPagination

class CarDetailDestroyView(generics.RetrieveDestroyAPIView):
    """
    Handles GET (retrieve) and DELETE (destroy) operations for a single Car instance.
    """
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    
    # Require authentication and ensure the user owns the car they are trying to delete.
    permission_classes = [IsAuthenticated] 
    
    # Optional: Override the queryset to limit checks to the user's cars for security/efficiency
    def get_queryset(self):
        user = self.request.user
        return Car.objects.filter(dealership__owner=user)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFCookieView(APIView):
    """Return a CSRF token and ensure the CSRF cookie is set for the frontend.

    The React frontend should call this endpoint (with credentials included)
    before making POST requests so the browser receives the CSRF cookie and
    the app can read the token from the JSON response to set the header.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = get_token(request)
        return Response({"csrfToken": token})
