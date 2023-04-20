from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.homepage, name='home'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('create-itinerary/<str:country>/', views.create_itinerary, name='create_itinerary'),
    path('create-itinerary/', views.create_itinerary, name='create_itinerary'),
    path('reviews/', views.reviews, name='reviews'),
    path('create-review/',views.create_review), 
    path('review_delete/<int:pk>/', views.review_delete, name='review_delete'),
    path('gdpr/',views.gdpr),
    path('recommend/',views.recommend, name="recommend"),
    path('travel-guide/', views.travel_guide, name='travel-guide'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

