
from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.homepage),
    path('create-itinerary/',views.create_itinerary),
    path('reviews/', views.reviews, name='reviews'),
    path('create-review/',views.create_review), 
    path('reviews/create/', views.create_review, name='create_review'),
    path('review_delete/<int:pk>/', views.review_delete, name='review_delete'),
    path('gdpr/',views.gdpr)
]
