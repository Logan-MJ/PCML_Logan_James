from django.db import models

# Create your models here.
class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return str(self.year) + " " + self.make + " " + self.model

class MaintenanceEvent(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    odometer = models.IntegerField()
    event_date = models.DateField()
    description = models.CharField(max_length=100)
    
    def __str__(self):
        return str(self.event_date) + " " + self.description
