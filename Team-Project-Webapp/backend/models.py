from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os
import json


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
        ('No Dietary Restriction', 'No Dietary Restriction'),
        ('Halal Restaurants', 'Halal Restaurants'),
        ('Vegan Restaurants', 'Vegan Restaurants'),
        ('Kosher Restaurants', 'Kosher Restaurants')
    ]
    ACCESSIBILITY_CHOICES = [
        ('No Accessibility Requirement', 'No Accessibility Requirement'),
        ('Wheelchair Accessible Place', 'Wheelchair Accessible Place'),
        ('Vision Impaired', 'Vision Impaired')
    ]
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    dietary_restrictions = models.CharField(max_length=100, choices=DIETARY_CHOICES, default='No Dietary Restriction')
    accessibility_needs = models.CharField(max_length=100, choices=ACCESSIBILITY_CHOICES, default='No Accessibility Requirement')
    preferences = models.CharField(max_length=100)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    age = models.IntegerField(blank=True, null=True)
    dietary_restrictions = models.CharField(max_length=100, null=True, blank=True, choices=Itinerary.DIETARY_CHOICES)
    accessibility_needs = models.CharField(max_length=100, null=True, blank=True, choices=Itinerary.ACCESSIBILITY_CHOICES)
    preferences = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True)

    def save(self, *args, **kwargs):
    # If the profile already has an existing profile picture and it's not the same as the new one
        if self.pk:
            old_profile = Profile.objects.get(pk=self.pk)
            old_profile_picture = old_profile.profile_picture
            new_profile_picture = self.profile_picture
            if old_profile_picture != new_profile_picture:
                if old_profile_picture and os.path.isfile(old_profile_picture.path):
                    os.remove(old_profile_picture.path)

        super(Profile, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} Profile'
    

class PreviousTrip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    summary = models.TextField()
    itinerary_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.summary

    def itinerary_data_list(self):
        return json.loads(self.itinerary_data)

