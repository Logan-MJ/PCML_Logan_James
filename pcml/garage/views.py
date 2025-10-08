from django.shortcuts import render

# Create your views here.

def home(request):
	"""Very basic home page view for /garage/home."""
	return render(request, 'garage/home.html')
