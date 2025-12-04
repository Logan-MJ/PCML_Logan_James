from django.contrib import admin
from .models import Car, MaintenanceEvent, Dealership
from .models import Profile

# Register your models here.
admin.site.register(Car)
admin.site.register(MaintenanceEvent)
admin.site.register(Dealership)
admin.site.register(Profile)
