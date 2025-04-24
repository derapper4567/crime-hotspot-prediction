
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data for crime prediction hotspots
const crimeHotspots = [
  { id: 1, lat: -6.776, lng: 39.178, risk: 'high', name: 'Central Dar es Salaam' },
  { id: 2, lat: -6.789, lng: 39.209, risk: 'medium', name: 'Kinondoni District' },
  { id: 3, lat: -6.816, lng: 39.280, risk: 'low', name: 'Kigamboni Area' },
  { id: 4, lat: -6.766, lng: 39.253, risk: 'high', name: 'Kariakoo Market' },
  { id: 5, lat: -6.820, lng: 39.210, risk: 'medium', name: 'Temeke District' },
];

// Risk levels and their corresponding colors
const riskColors = {
  high: '#e63946',
  medium: '#f6bd60',
  low: '#2a9d8f',
};

interface MapProps {
  apiKey?: string; // Google Maps API key would go here in a real implementation
  onSelectLocation?: (location: any) => void;
}

const Map = ({ apiKey, onSelectLocation }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  // This would be replaced with actual Google Maps integration in production
  useEffect(() => {
    if (mapRef.current) {
      // In a real app, this would initialize Google Maps
      console.log('Map would initialize here with key:', apiKey);
      
      // For now, we'll just simulate the map with a placeholder
      const mapElement = mapRef.current;
      mapElement.style.backgroundImage = "url('https://maps.googleapis.com/maps/api/staticmap?center=-6.776,39.178&zoom=12&size=600x400&maptype=roadmap')";
      mapElement.style.backgroundSize = "cover";
      mapElement.style.backgroundPosition = "center";
    }
  }, [apiKey]);

  const handleLocationSelect = (id: number) => {
    setSelectedLocation(id);
    const location = crimeHotspots.find(spot => spot.id === id);
    if (location && onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search locations using Google Maps API
    console.log('Searching for:', searchValue);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Crime Prediction Map</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="block w-3 h-3 rounded-full bg-crime-high"></span>
            <span className="text-sm">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="block w-3 h-3 rounded-full bg-crime-medium"></span>
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="block w-3 h-3 rounded-full bg-crime-low"></span>
            <span className="text-sm">Low Risk</span>
          </div>
        </div>
      </div>
      
      <div className="relative mb-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-md text-sm"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
        {/* This would be replaced with an actual Google Maps component */}
        <div ref={mapRef} className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-lg font-medium mb-2">Interactive Map Placeholder</p>
            <p className="text-sm text-gray-500">In a production environment, this would be an interactive Google Map.</p>
          </div>
        </div>
        
        {/* Simulated hotspot markers */}
        <div className="absolute inset-0 pointer-events-none">
          {crimeHotspots.map(spot => (
            <div
              key={spot.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto ${
                selectedLocation === spot.id ? 'z-20' : 'z-10'
              }`}
              style={{ 
                left: `${10 + (spot.id * 15)}%`, 
                top: `${20 + (spot.id * 10)}%`,
              }}
              onClick={() => handleLocationSelect(spot.id)}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center animate-pulse-slow ${
                  selectedLocation === spot.id ? 'ring-4 ring-opacity-50' : ''
                }`}
                style={{ 
                  backgroundColor: riskColors[spot.risk as keyof typeof riskColors],
                  boxShadow: `0 0 0 rgba(${spot.risk === 'high' ? '230, 57, 70' : spot.risk === 'medium' ? '246, 189, 96' : '42, 157, 143'}, 0.4)`,
                  animation: 'pulse 2s infinite',
                }}
              >
                {spot.risk === 'high' ? (
                  <AlertTriangle className="w-3 h-3 text-white" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              {selectedLocation === spot.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-1 rounded-md shadow-lg text-xs font-medium z-30 whitespace-nowrap">
                  {spot.name} - {spot.risk.charAt(0).toUpperCase() + spot.risk.slice(1)} Risk
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
