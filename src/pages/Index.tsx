import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Map, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="crime-gradient-bg flex-1 flex flex-col items-center justify-center text-white p-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center mb-6">
            <Shield className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">Ulinzi Kitaa</h1>
          </div>
          
          <p className="text-xl mb-10 md:px-12">
            Advanced security and monitoring system using modern technology and data analytics.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="glass-card p-6 w-56 text-center animate-float">
              <Map className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Predictive Mapping</h3>
              <p className="text-sm opacity-90">Identify crime hotspots before incidents occur</p>
            </div>
            
            <div className="glass-card p-6 w-56 text-center animate-float" style={{ animationDelay: "0.2s" }}>
              <Camera className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Detection</h3>
              <p className="text-sm opacity-90">AI-powered surveillance monitoring</p>
            </div>
            
            <div className="glass-card p-6 w-56 text-center animate-float" style={{ animationDelay: "0.4s" }}>
              <MapPin className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm opacity-90">Real-time notification system</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <Button 
              size="lg"
              className="bg-white text-crime-dark hover:bg-white/90"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-crime-dark"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
          
          <p className="mt-4 text-sm opacity-80">
            Redirecting to login page in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
