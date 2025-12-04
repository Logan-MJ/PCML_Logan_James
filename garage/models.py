from django.db import models
from django.contrib.auth.models import User # Import the built-in User model

# 1. Dealership Model
# This model is owned by a User and will act as a container for Cars.
class Dealership(models.Model):
    # Link to the built-in Django User model (one-to-many: one user can own many dealerships)
    # If the user is deleted, all their dealerships are deleted (CASCADE).
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name_plural = "Dealerships"
    
    def __str__(self):
        return self.name
    
# 2. Car Model (Updated)
class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Link to the Dealership model
    dealership = models.ForeignKey(
        Dealership, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='cars'
    )
    
    # --- ADD THIS Meta CLASS ---
    class Meta:
        # Define a default sort order. Sort by year descending (-year) 
        # and then by make ascending (make) for consistency.
        ordering = ['-year', 'make'] 
        
    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

# 3. MaintenanceEvent Model (Unchanged)
class MaintenanceEvent(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    odometer = models.IntegerField()
    event_date = models.DateField()
    description = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.event_date} - {self.description}"


# Optional Profile model to store additional user info like bio and profile picture
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.username}"