import joblib
import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

class CrimePredictor:
    def __init__(self):
        self.model = joblib.load('myapp/ml/model.pkl')
        self.columns = joblib.load('myapp/ml/columns.pkl')
        self.geolocator = Nominatim(user_agent="crime_prediction_app")
    
    def geocode(self, address):
        try:
            location = self.geolocator.geocode(address)
            return location.latitude, location.longitude if location else (None, None)
        except GeocoderTimedOut:
            return None, None
    
    def predict_risk(self, address, crime_type):
        lat, lon = self.geocode(address)
        if not lat or not lon:
            return {"error": "Could not locate address"}
        
        features = pd.DataFrame({
            'Longitude': [lon],
            'Latitude': [lat],
            'Crime type': [crime_type]
        })
        
        features = pd.get_dummies(features)
        
        # Ensure all training columns exist
        for col in self.columns:
            if col not in features.columns:
                features[col] = 0
                
        features = features[self.columns]
        
        proba = self.model.predict_proba(features)[0]
        prediction = self.model.predict(features)[0]
        
        return {
            'address': address,
            'coordinates': (lat, lon),
            'crime_type': crime_type,
            'risk_probability': float(proba[1]),
            'risk_level': 'High' if prediction == 1 else 'Low'
        }