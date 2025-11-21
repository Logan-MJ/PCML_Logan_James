from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.user.username

# class Dealership(models.Model):
#     owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     location = models.CharField(max_length=255, blank=True)

#     def __str__(self):
#         return self.name
    
class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # dealership = models.ForeignKey(Dealership, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return str(self.year) + " " + self.make + " " + self.model

class MaintenanceEvent(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    odometer = models.IntegerField()
    event_date = models.DateField()
    description = models.CharField(max_length=100)

    def __str__(self):
        return str(self.event_date) + " " + self.description
