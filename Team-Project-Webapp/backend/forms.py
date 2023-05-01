from django import forms
from .models import Review, Itinerary, Profile
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm

class SignupForm(UserCreationForm):
    username = forms.CharField(max_length=30, required=True, help_text='Required. 30 characters or fewer.')
    password1 = forms.CharField(widget=forms.PasswordInput, help_text='Required. Enter a strong password.')
    password2 = forms.CharField(widget=forms.PasswordInput, help_text='Enter the same password as above, for verification.')


class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter password'}))


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'age', 'dietary_restrictions', 'accessibility_needs', 'preferences', 'profile_picture')

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        
class ItineraryForm(forms.ModelForm):
    class Meta:
        model = Itinerary
        fields = ['destination', 'start_date', 'end_date',  'dietary_restrictions', 'accessibility_needs', 'preferences']

