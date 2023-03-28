from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Review(models.Model):
    RATINGS = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATINGS)
    comment = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Review"
    
    
class Itinerary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    DIETARY_CHOICES = [
        ('Halal', 'Halal'),
        ('Vegan', 'Vegan'),
        ('Vegetarian', 'Vegetarian'),
        ('Kosher', 'Kosher'),
        ('Carnivore', 'Carnivore')
    ]
    ACCESSIBILITY_CHOICES = [
        ('Impaired vision', 'Impaired vision'),
        ('Impaired hearing', 'Impaired hearing'),
        ('Wheel-chair bound', 'Wheel-chair bound')
    ]
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=0)
    dietary_restrictions = models.CharField(max_length=100, choices=DIETARY_CHOICES, default='No dietary restrictions')
    accessibility_needs = models.CharField(max_length=100, choices=ACCESSIBILITY_CHOICES, default='No accessibility needs')
    preferences = models.CharField(max_length=100)



# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255, blank=True)
#     age = models.IntegerField(blank=True, null=True)
#     budget = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
#     dietary_restrictions = models.CharField(max_length=100, null=True, blank=True, choices=Itinerary.DIETARY_CHOICES)
#     accessibility_needs = models.CharField(max_length=100, null=True, blank=True, choices=Itinerary.ACCESSIBILITY_CHOICES)
#     preferences = models.CharField(max_length=100, null=True, blank=True)

#     profile_picture = models.ImageField(upload_to='profile_pictures', blank=True)

#     def __str__(self):
#         return f'{self.user.username} Profile'
