from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello),
]

urlpatterns = [
    # This one endpoint handles GET (list cars) and POST (create car)
    path('api/cars/', views.CarListCreateView.as_view(), name='car-list-create'),
]