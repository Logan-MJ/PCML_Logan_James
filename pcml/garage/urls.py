from django.urls import path
from . import views

urlpatterns = [
	# Serve the home view at the app root so /garage/ shows the home page
	path('', views.home, name='home'),
]