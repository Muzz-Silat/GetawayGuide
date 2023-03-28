from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from .models import Review
from .forms import ReviewForm
from django.contrib import messages
import pip._vendor.requests 
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignupForm
from django.shortcuts import render, get_object_or_404
from django.shortcuts import render, redirect
from .forms import ReviewForm
from .models import Review
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth import login
from django.shortcuts import render, get_object_or_404
# from .forms import ItineraryForm
# from .forms import UserProfileForm
from django.core.exceptions import ObjectDoesNotExist
from .models import Itinerary
from .forms import LoginForm

# Create your views here.
def homepage(request):
    if not request.user.is_authenticated:
        return redirect('login')
    response = pip._vendor.requests.get('http://api.weatherapi.com/v1/current.json?key=84a1a048b3304244957125921231303&q=Dubai&aqi=no').json()
    details= {
        'location': response['location'],
        'current' : response['current'],
    }
    return render(request,'homepage.html',details)

def create_itinerary(request):
    return render(request,'create-itinerary.html')

def reviews(request):
    reviews = Review.objects.all()
    return render(request,'reviewpage.html',{'reviews': reviews})

@login_required
def create_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.save()
            messages.success(request, 'Thank you for your review!')
            return redirect('reviews')
    else:
        form = ReviewForm()

    context = {'form': form}
    return render(request, 'create-review.html', context)


@login_required
def review_delete(request, pk):
    review = get_object_or_404(Review, pk=pk)
    if request.user == review.user:
        review.delete()
        messages.success(request, 'Your review has been deleted.')
    else:
        messages.error(request, 'You are not authorized to delete this review.')
    return redirect('reviews')

def gdpr(request): 
	return render(request,'gdpr.html')

def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.info(request, f"You are now logged in as {user.username}.")
            return redirect('home')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect('home')








