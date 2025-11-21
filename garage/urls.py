from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello),
    path('cars/', views.CarListCreateView.as_view(), name='car-list-create'),
    path('cars/', views.CarListView.as_view(), name='car-list'),
]