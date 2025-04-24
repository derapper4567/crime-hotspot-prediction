
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

interface PredictionResult {
  address: string;
  coordinates: [number, number];
  crime_type: string;
  risk_level: string;
  risk_probability: number;
  map_html?: string;
  error?: string;
  saved_to_history?: boolean;
  history_error?: string;
}

const Prediction = () => {
  const [address, setAddress] = useState('');
  const [crimeType, setCrimeType] = useState('');
  const [crimeTypes, setCrimeTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCrimeTypes = async () => {
      try {
        const types = await api.getCrimeTypes();
        setCrimeTypes(types);
        if (types.length > 0) {
          setCrimeType(types[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load crime types",
          variant: "destructive",
        });
      }
    };

    fetchCrimeTypes();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    try {
      // Add detailed logging
      console.log("Making prediction request:", { address, crimeType });
      
      // Check if inputs are valid
      if (!address.trim()) {
        throw new Error("Please enter a valid address");
      }
      
      if (!crimeType) {
        throw new Error("Please select a crime type");
      }
      
      const predictionResult = await api.predict(address, crimeType);
      console.log("Prediction response:", predictionResult);
      
      // Check if the result contains an error
      if (predictionResult.error) {
        toast({
          title: "Prediction Error",
          description: predictionResult.error,
          variant: "destructive",
        });
        return;
      }
      
      setResult(predictionResult);
      
      toast({
        title: "Prediction Complete",
        description: `Risk level: ${predictionResult.risk_level}`,
      });
    } catch (error) {
      console.error("Error making prediction:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to fetch prediction data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Crime Prediction</h1>
          <p className="text-muted-foreground">View crime prediction hotspots across Tanzania</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Make a Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Location Address</label>
                  <Input
                    id="address"
                    placeholder="Enter an address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="crimeType" className="text-sm font-medium">Crime Type</label>
                  <Select value={crimeType} onValueChange={setCrimeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crime type" />
                    </SelectTrigger>
                    <SelectContent>
                      {crimeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Predicting..." : "Predict Risk"}
                </Button>
                {/* Test connection button removed */}
              </form>
            </CardContent>
          </Card>
          
          {result && !result.error && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{result.address}</p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {result.coordinates[0]}, {result.coordinates[1]}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Crime Type</h3>
                    <p>{result.crime_type}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Risk Assessment</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        result.risk_level === 'High' ? 'bg-red-500' : 
                        result.risk_level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <p>{result.risk_level} Risk ({(result.risk_probability * 100).toFixed(1)}%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* New large map section */}
        {result && !result.error && result.map_html && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Crime Risk Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-md overflow-hidden h-96 w-full"
                dangerouslySetInnerHTML={{ __html: result.map_html }} 
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Prediction;
