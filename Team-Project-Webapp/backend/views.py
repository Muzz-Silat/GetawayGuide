from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from .models import Review
from .forms import ReviewForm
from django.contrib import messages
import pip._vendor.requests 

# Create your views here.
def login(request):
    return render(request, 'login.html')

def homepage(request):
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

def create_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.save()
            messages.success(request, 'Thank you for your review!')
            return redirect('reviews')
    else:
        form = ReviewForm()

    context = {'form': form}
    return render(request, 'create-review.html', context)


def review_delete(request, pk):
    review = get_object_or_404(Review, pk=pk)
    review.delete()
    return redirect('reviews')

def gdpr(request): 
	return render(request,'gdpr.html')
