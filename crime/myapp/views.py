

# Create your views here.
from django.shortcuts import render , redirect
from .ml.predictor import CrimePredictor

predictor = CrimePredictor()

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
    return redirect('home')