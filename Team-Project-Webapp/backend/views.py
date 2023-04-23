from django.shortcuts import render,redirect,get_object_or_404
from django.http import JsonResponse
from .models import Review
from .forms import ReviewForm
from django.contrib import messages 
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
from django.shortcuts import render
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from scipy.spatial import distance
from django import forms
import csv
import requests
from datetime import datetime, timedelta
import json, openai
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from .forms import UserProfileForm


def homepage(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request,'homepage.html')

def create_itinerary(request, country=None):
    # if country:
    #     return render(request, 'create-itinerary.html', {'country': country})
    # else:
    #     return render(request, 'create-itinerary.html')
    
    API_KEY = 'AIzaSyC20xZiIEWNdxKMsa-HMY8eATSaJ2JfgxI'
    dietary_restriction = request.GET.get('dietary-restriction')
    location = request.GET.get('location')
    accessibility = request.GET.get('accessibility')
    start_date = request.GET.get('start-date')
    end_date = request.GET.get('end-date')

    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
        date_difference = (end_date_obj - start_date_obj).days
        days_range = list(range(1, date_difference + 1))
    else:
        date_difference = None
        days_range = None
        
        
    accessible_attractions = []
    if location:
        # Search for tourist attractions in the user's location
        attraction_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+{}&key={}'.format(location, API_KEY)
        attraction_response = requests.get(attraction_url)
        attractions = json.loads(attraction_response.content)['results']
        for place in attractions:
            # Retrieve more details about the place
            detail_url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={}&fields=name,rating,formatted_address,opening_hours,website,photo&key={}'.format(place['place_id'], API_KEY)
            detail_response = requests.get(detail_url)
            detail = json.loads(detail_response.content)['result']
            place.update(detail)

        if accessibility:
            # Search for accessible tourist attractions in the user's location
            accessible_attraction_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query={}+tourist+attractions+in+{}&key={}'.format(accessibility, location, API_KEY)
            accessible_attraction_response = requests.get(accessible_attraction_url)
            accessible_attractions = json.loads(accessible_attraction_response.content)['results']
            for place in accessible_attractions:
                # Retrieve more details about the place
                detail_url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={}&fields=name,rating,formatted_address,opening_hours,website,photo&key={}'.format(place['place_id'], API_KEY)
                detail_response = requests.get(detail_url)
                detail = json.loads(detail_response.content)['result']
                place.update(detail)

        # (Continue with the rest of the original code for dietary restriction, restaurants, and hotels)
        # Create the query based on the user's dietary restriction
        if dietary_restriction == 'halal':
            query = 'halal+restaurants+in+{}'.format(location)
        elif dietary_restriction == 'vegan':
            query = 'vegan+restaurants+in+{}'.format(location)
        elif dietary_restriction == 'kosher':
            query = 'kosher+restaurants+in+{}'.format(location)
        else:
            query = 'restaurants+in+{}'.format(location)

         # Create the query based on the user's accessibility requirement
        if accessibility == 'wheelchair':
            accessibility_query = '+wheelchair+accessible'
        elif accessibility == 'vision-impaired':
            accessibility_query = '+vision+impaired+accessible'
        else:
            accessibility_query = ''

        # Search for restaurants in the user's location
        restaurant_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query={}&key={}'.format(query, API_KEY)
        restaurant_response = requests.get(restaurant_url)
        restaurants = json.loads(restaurant_response.content)['results']
        for place in restaurants:
            # Retrieve more details about the place
            detail_url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={}&fields=name,rating,formatted_address,opening_hours,website,photo&key={}'.format(place['place_id'], API_KEY)
            detail_response = requests.get(detail_url)
            detail = json.loads(detail_response.content)['result']
            place.update(detail)

        # Search for hotels in the user's location
        hotel_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+{}&key={}'.format(location, API_KEY)
        hotel_response = requests.get(hotel_url)
        hotels = json.loads(hotel_response.content)['results']
        for place in hotels:
            # Retrieve more details about the place
            detail_url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={}&fields=name,rating,formatted_address,opening_hours,website,photo&key={}'.format(place['place_id'], API_KEY)
            detail_response = requests.get(detail_url)
            detail = json.loads(detail_response.content)['result']
            place.update(detail)
            
        custom_results = []
        custom_query = request.GET.get('custom-query')

        if custom_query:
            custom_query_with_location = '{}+in+{}'.format(custom_query, location)
            custom_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query={}&key={}'.format(custom_query_with_location, API_KEY)
            custom_response = requests.get(custom_url)
            custom_results = json.loads(custom_response.content)['results']
            for place in custom_results:
                detail_url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={}&fields=name,rating,formatted_address,opening_hours,website,photo&key={}'.format(place['place_id'], API_KEY)
                detail_response = requests.get(detail_url)
                detail = json.loads(detail_response.content)['result']
                place.update(detail)

        return render(request, 'create-trip.html', {'attractions': attractions, 'accessible_attractions': accessible_attractions, 'restaurants': restaurants, 'hotels': hotels, 'location': location, 'dietary_restriction': dietary_restriction, 'accessibility': accessibility, 'custom_results': custom_results, 'custom_query': custom_query, 'date_difference': date_difference, 'days_range': days_range})
    return render(request, 'create-itinerary.html')
    
def trip_summary(request):
    itinerary_data = request.POST.getlist('itinerary[]')
    context = {
        'itinerary_data': itinerary_data,
    }
    return render(request, 'trip-summary.html', context)

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

def recommend(request):
    recommendations = None
    form = RecommendationForm()
    if request.method == 'POST':
        form = RecommendationForm(request.POST)
        if form.is_valid():
            # load the data from the CSV file
            df = pd.read_csv('backend/data/Countries.csv', encoding='cp1252')
            # create a scaler object
            scaler = StandardScaler()

            # scale the data
            scaled_data = scaler.fit_transform(df[['Latitude', 'Longitude', 'Avg. Temp', 'No. of Tourists']])

            # create a KMeans model with 3 clusters
            kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)

            # fit the model to the scaled data
            kmeans.fit(scaled_data)

            # add a new column to the dataframe with the cluster labels
            df['Cluster'] = kmeans.labels_

            # # Debugging: print a list of all the countries and their cluster labels
            # countries_and_clusters = df[['Countries', 'Cluster']].values.tolist()
            # print(countries_and_clusters)

            # get input from the user
            country1 = request.POST.get('country1')
            country2 = request.POST.get('country2')
            country3 = request.POST.get('country3')
        
            if country1 and country2 and country3:
                # find the rows for the user's input
                user_rows = df.loc[df['Countries'].isin([country1, country2, country3])]

                if user_rows.empty:
                    message = "Sorry, one or more of the entered countries could not be found."
                else:
                    # get the cluster labels for the user's countries
                    user_clusters = user_rows['Cluster'].unique()

                    # get the rows for all countries in the same clusters as the user's countries
                    cluster_rows = df.loc[df['Cluster'].isin(user_clusters)]

                    # if there are fewer than 3 countries in the cluster, get additional countries from the nearest clusters
                    if len(cluster_rows) < 3:
                        # calculate the distance between the user's countries and all other countries
                        distances = []
                        for index, row in df.iterrows():
                            if row['Countries'] not in [country1, country2, country3]:
                                dist = distance.euclidean(row[['Latitude', 'Longitude', 'Avg. Temp', 'No. of Tourists']], user_rows[['Latitude', 'Longitude', 'Avg. Temp', 'No. of Tourists']].mean())
                                distances.append((row['Countries'], dist))

                        # sort the distances and get the countries with the smallest distances
                        distances.sort(key=lambda x: x[1])
                        recommended_countries = [country for country, dist in distances[:3-len(cluster_rows)]]

                        # get the rows for the recommended countries
                        recommended_rows = df.loc[df['Countries'].isin(recommended_countries)]

                        # concatenate the cluster rows and the recommended rows
                        final_rows = pd.concat([cluster_rows, recommended_rows])
                    else:
                        final_rows = cluster_rows

                    # sort the final rows by number of tourists in descending order and get the top 3
                    recommended = final_rows.sort_values(by='No. of Tourists', ascending=False).head(3)
                    recommended = recommended[~recommended['Countries'].isin([country1, country2, country3])] # filter out the user's input countries

                    recommendations = recommended['Countries'].tolist()
                
    context = {'form': form,'recommendations': recommendations}
    return render(request, 'recommend.html', context)


def get_country_choices():
    with open('backend/data/Countries.csv', 'r', encoding='cp1252') as f:
        reader = csv.DictReader(f)
        countries = sorted(set(row['Countries'] for row in reader))
    return [(country, country) for country in countries]

class RecommendationForm(forms.Form):
    choices = [("", "--")] + get_country_choices()
    country1 = forms.ChoiceField(choices=choices, widget=forms.Select(attrs={'class': 'country1-input', 'class': 'country1'}), label='Country 1')
    country2 = forms.ChoiceField(choices=choices, widget=forms.Select(attrs={'class': 'country2-input', 'class': 'country2'}), label='Country 2')
    country3 = forms.ChoiceField(choices=choices, widget=forms.Select(attrs={'class': 'country3-input', 'class': 'country3'}), label='Country 3')
    
def format_utc_offset(seconds):
    sign = '-' if seconds < 0 else '+'
    hours, remainder = divmod(abs(seconds), 3600)
    minutes, _ = divmod(remainder, 60)
    return f'{sign}{hours:02d}:{minutes:02d}'

def get_price_range(establishment_type, place_name, country):
    prompt = f"Can you give me only the price range of the {establishment_type} {place_name} in {country} in the format '$XXX-$XXX', without any other text besides the format"
    openai.api_key = "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"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=50,
        n=1,
        stop=None,
        temperature=0.5,
    )
    price_range = response.choices[0].text.strip()
    # Remove the "?" character from the price range string
    price_range = price_range.replace("?", "")

    return price_range

def travel_guide(request):
    api_key = 'AIzaSyC20xZiIEWNdxKMsa-HMY8eATSaJ2JfgxI'
    if request.method == 'POST':
        location = request.POST['location']
        # queries = request.POST.getlist('query')
        # queries = request.POST.getlist('query') + ["event"]
        queries = request.POST.getlist('query')
        if "event" not in queries:
            queries += ["Events"]
        results = {}

        # Get the coordinates for the location
        geocode_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={api_key}'
        geocode_response = requests.get(geocode_url)
        geocode_data = geocode_response.json()
        lat = geocode_data['results'][0]['geometry']['location']['lat']
        lng = geocode_data['results'][0]['geometry']['location']['lng']

        # Get the timezone for the location
        timestamp = int(datetime.now().timestamp())
        timezone_url = f'https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lng}&timestamp={timestamp}&key={api_key}'
        timezone_response = requests.get(timezone_url)
        timezone_data = timezone_response.json()
        timezone_id = timezone_data['timeZoneId']
        timezone_offset = timezone_data['rawOffset']
        dst_offset = timezone_data['dstOffset']
        
        # Get the country code for the location
        address_components = geocode_data['results'][0]['address_components']
        country_code = ''
        for component in address_components:
            if 'country' in component['types']:
                country_code = component['short_name']
                break

        # Get the country details (currency and language)
        country_url = f'https://restcountries.com/v2/alpha/{country_code.lower()}'
        country_response = requests.get(country_url)
        country_data = country_response.json()
        currency = country_data['currencies'][0]['name']
        languages = [lang['name'] for lang in country_data['languages']]
        population = country_data['population']
        flag_url = country_data['flag']
        calling_code = country_data['callingCodes'][0]
        
        weather_api_key = '84a1a048b3304244957125921231303'
        weather_url = f'http://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={location}'
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()
        temperature = weather_data['current']['temp_c']
        weather_icon = weather_data['current']['condition']['icon']
        

        # Calculate the local time
        utc_time = datetime.utcfromtimestamp(timestamp)
        local_time = utc_time + timedelta(seconds=(timezone_offset + dst_offset))
        # local_time = local_time.strftime('%d-%m-%Y %H:%M:%S')
        
        # gmt_time = datetime.utcnow().strftime('%d-%m-%Y %H:%M:%S')
        local_time = local_time.strftime('%Y-%m-%d %H:%M:%S')
        gmt_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')


        markers = []

        for query in queries:
            if not query.strip():
                continue
            if query.lower() == "place":
                query = "Tourist Attractions"
            url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}+in+{location}&key={api_key}'
            response = requests.get(url)
            data = response.json()
            if 'results' in data:
                places = []
                for result in data['results']:
                    details_url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={result["place_id"]}&fields=name,formatted_address,geometry,photo,website,opening_hours,rating&key={api_key}'
                    details_response = requests.get(details_url)
                    details_data = details_response.json()
                    place = {
                        'name': details_data['result']['name'],
                        'address': details_data['result']['formatted_address'],
                        'latitude': details_data['result']['geometry']['location']['lat'],
                        'longitude': details_data['result']['geometry']['location']['lng'],
                        'photo_url': None,
                        'place_id': result['place_id'],
                        'website': details_data['result'].get('website', ''),
                        'opening_hours': details_data['result'].get('opening_hours', {}).get('weekday_text', []),
                        'rating': details_data['result'].get('rating', None),
                        'price_range': None
                    }
                    if 'photos' in details_data ['result']:
                        photo_ref = details_data['result']['photos'][0]['photo_reference']
                        place['photo_url'] = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={api_key}'
                    query_lower = query.lower()
                    if "restaurant" in query_lower or "hotel" in query_lower:
                        place['price_range'] = get_price_range(query, place['name'], location)    
                    places.append(place)
                    markers.append({'name': place['name'], 'latitude': place['latitude'], 'longitude': place['longitude']})
                results[query] = places
            else:
                results[query] = None

        return render(request, 'travel-guide.html', {'results': results, 'location': location, 'markers': json.dumps(markers), 'timezone_id': timezone_id, 'local_time': local_time, 'gmt_time': gmt_time, 'gmt_offset': format_utc_offset(timezone_offset), 'currency': currency, 'languages': languages, 'population': population, 'flag_url': flag_url, 'calling_code': calling_code, 'utc_offset': format_utc_offset(timezone_offset), 'dst_observed': bool(dst_offset), 'temperature': temperature, 'weather_icon': weather_icon})
    else:
        return render(request, 'travel-guide-form.html')



def create_profile(request, mode="view"):
    if not request.user.is_authenticated:
        return redirect('login')

    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        profile = None

    if request.method == 'POST' and mode == "edit":
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            user_profile = form.save(commit=False)
            user_profile.user = request.user
            user_profile.save()
            return redirect('create-profile', mode='view')
    else:
        form = UserProfileForm(instance=profile)

    if mode == 'view':
        template_name = 'view-profile.html'
    else:
        template_name = 'edit-profile.html'

    return render(request, template_name, {'form': form, 'mode': mode})

@login_required
def get_user_profile(request):
    try:
        profile = request.user.profile
        data = {
            'budget': profile.budget,
            'dietary_restrictions': profile.dietary_restrictions,
            'accessibility_needs': profile.accessibility_needs,
            'preferences': profile.preferences,
        }
        return JsonResponse(data)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Profile not found'})


def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('home')
        else:
            messages.error(request, 'Please correct the error(s) below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'change-password.html', {'form': form})

@login_required
def delete_account(request):
    if request.method == "POST":
        password = request.POST.get("password", "")
        if request.user.check_password(password):
            request.user.delete()
            logout(request)
            messages.success(request, 'Account successfully deleted.')
            return redirect('login')
        else:
            messages.error(request, 'Incorrect password. Please try again.')

    return render(request, 'delete-account.html')

def settings(request):
  return render(request, 'settings.html')