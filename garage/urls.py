from django.urls import path
from . import views

urlpatterns = [
    # 1. HTML VIEW (Fixes the 404 error for /garage/)
    # This path matches the empty string, completing the route from the project's urls.py
    path('', views.garage_home, name='garage_home'),
    
    # 2. Existing simple JSON endpoint
    path('hello/', views.hello, name='hello'),
    
    # 3. Existing DRF Car Endpoints
    # NOTE: It's redundant to have two patterns named 'cars/' and 'cars/' but matching 
    # the exact same path. I've kept both for now based on your previous content.
    path('cars/list_create/', views.CarListCreateView.as_view(), name='car-list-create'),
    path('cars/', views.CarListView.as_view(), name='car-list'),

    path('cars/<int:pk>/', views.CarDetailDestroyView.as_view(), name='car-detail-destroy'),
    
    # 4. API ENDPOINT for React Login
    path('api/login/', views.LoginAPIView.as_view(), name='api_login'),
    
    # 5. API ENDPOINT for React Logout
    path('api/logout/', views.LogoutAPIView.as_view(), name='api_logout'),

    path('api/status/', views.AuthStatusAPIView.as_view(), name='api_status'),
]