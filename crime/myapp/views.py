

from django.shortcuts import render, redirect
from .ml.predictor import CrimePredictor
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login  # This is the correct import
from django.contrib.auth.models import User
from django.views import View
from django.contrib.auth import get_user_model
from django import forms

# Initialize predictor
predictor = CrimePredictor()

class LoginForm(forms.Form):
    username = forms.CharField(required=True)

class CustomLoginView(View):
    def get(self, request):
        return render(request, 'myapp/login.html', {'form': LoginForm()})

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            User = get_user_model()
            try:
                user = User.objects.get(username=username)
                login(request, user)  # Changed from auth_login to login
                return redirect('myapp:home')
            except User.DoesNotExist:
                form.add_error('username', 'Invalid username')
        
        return render(request, 'myapp/login.html', {'form': form})

@login_required
def index(request):
    return redirect('myapp:home')

def home(request):
    crime_types = [
        'Theft from the person',
        'Bicycle theft',
        'Other theft',
        'Violence and sexual offences',
        'Anti-social behaviour'
    ]
    return render(request, 'myapp/index.html', {'crime_types': crime_types})

def predict(request):
    if request.method == 'POST':
        address = request.POST.get('address')
        crime_type = request.POST.get('crime_type')
        result = predictor.predict_risk(address, crime_type)
        return render(request, 'myapp/results.html', {'result': result})
    return redirect('myapp:home')