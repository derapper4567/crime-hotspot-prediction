import joblib
import pandas as pd
import folium  # Required for map creation
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
    
    def create_map(self, lat, lon, risk_level):
        """Create a folium map centered on the location"""
        m = folium.Map(
            location=[lat, lon],
            zoom_start=15,
            tiles="OpenStreetMap"
        )
        
        # Customize marker based on risk level
        icon_color = 'red' if risk_level == 'High' else 'green'
        folium.Marker(
            [lat, lon],
            popup=f"Risk Level: {risk_level}",
            icon=folium.Icon(color=icon_color, icon='info-sign')
        ).add_to(m)
        
        # Add danger zone circle (200m radius)
        folium.Circle(
            location=[lat, lon],
            radius=200,  # 200 meters
            color=icon_color,
            fill=True,
            fill_opacity=0.2,
            popup="Risk Assessment Area"
        ).add_to(m)
        
        return m._repr_html_()  # Return HTML for embedding
    
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
        risk_level = 'High' if prediction == 1 else 'Low'
        
        # Generate the map HTML
        map_html = self.create_map(lat, lon, risk_level)
        
        return {
            'address': address,
            'coordinates': (lat, lon),
            'crime_type': crime_type,
            'risk_level': risk_level,
            'risk_probability': proba[1] if risk_level == 'High' else proba[0],
            'map_html': map_html  
        }