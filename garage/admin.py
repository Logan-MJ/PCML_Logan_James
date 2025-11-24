from django.contrib import admin
from .models import Car, MaintenanceEvent, Dealership

# Register your models here.
admin.site.register(Car)
admin.site.register(MaintenanceEvent)
admin.site.register(Dealership)
