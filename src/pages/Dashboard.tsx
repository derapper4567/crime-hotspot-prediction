import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define types for our prediction data
interface PredictionResult {
  address: string;
  coordinates: [number, number];
  crime_type: string;
  risk_level: string;
  risk_probability: number;
  timestamp?: string;
}

// Analytics data types
interface CrimeTypeCount {
  name: string;
  count: number;
}

interface RiskLevelCount {
  name: string;
  count: number;
  color: string;
}

const Dashboard = () => {
  const [recentPredictions, setRecentPredictions] = useState<PredictionResult[]>([]);
  const [crimeTypeData, setCrimeTypeData] = useState<CrimeTypeCount[]>([]);
  const [riskLevelData, setRiskLevelData] = useState<RiskLevelCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch recent predictions when component mounts
    const fetchRecentPredictions = async () => {
      try {
        setIsLoading(true);
        const data = await api.getRecentPredictions();
        console.log("Received predictions:", data); // Debug log
        
        // Check if data has the expected structure
        if (data && data.predictions) {
          setRecentPredictions(data.predictions);
          
          // Process data for analytics
          processAnalyticsData(data.predictions);
        } else {
          console.error("Unexpected data format:", data);
          toast({
            title: "Data format error",
            description: "Received unexpected data format from server",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
        toast({
          title: "Failed to load predictions",
          description: "Could not retrieve recent prediction data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPredictions();
  }, [toast]);

  // Process data for analytics charts
  const processAnalyticsData = (predictions: PredictionResult[]) => {
    // Count crime types
    const crimeTypeCounts: Record<string, number> = {};
    predictions.forEach(pred => {
      crimeTypeCounts[pred.crime_type] = (crimeTypeCounts[pred.crime_type] || 0) + 1;
    });
    
    const crimeTypeArray = Object.entries(crimeTypeCounts).map(([name, count]) => ({
      name,
      count
    }));
    setCrimeTypeData(crimeTypeArray);

    // Count risk levels
    const riskLevelCounts: Record<string, number> = {};
    predictions.forEach(pred => {
      riskLevelCounts[pred.risk_level] = (riskLevelCounts[pred.risk_level] || 0) + 1;
    });
    
    const riskColors = {
      'High': '#ef4444',
      'Medium': '#f59e0b',
      'Low': '#22c55e'
    };
    
    const riskLevelArray = Object.entries(riskLevelCounts).map(([name, count]) => ({
      name,
      count,
      color: riskColors[name as keyof typeof riskColors] || '#94a3b8'
    }));
    setRiskLevelData(riskLevelArray);
  };

  // Calculate summary statistics
  const getTotalPredictions = () => recentPredictions.length;
  
  const getHighRiskPercentage = () => {
    const highRiskCount = recentPredictions.filter(p => p.risk_level === 'High').length;
    return recentPredictions.length > 0 
      ? Math.round((highRiskCount / recentPredictions.length) * 100) 
      : 0;
  };
  
  const getMostCommonCrimeType = () => {
    if (crimeTypeData.length === 0) return 'N/A';
    return crimeTypeData.sort((a, b) => b.count - a.count)[0].name;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">View your recent crime predictions and analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalPredictions()}</div>
              <p className="text-xs text-muted-foreground">
                Total predictions made
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getHighRiskPercentage()}%</div>
              <p className="text-xs text-muted-foreground">
                Percentage of high risk predictions
              </p>
            </CardContent>
          </Card>
          
          
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Crime Type Distribution</CardTitle>
              <CardDescription>
                Breakdown of predictions by crime type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading analytics...</p>
              ) : crimeTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No data available for analysis</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>
                Breakdown of predictions by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading analytics...</p>
              ) : riskLevelData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No data available for analysis</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Your most recent crime risk predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading recent predictions...</p>
                ) : recentPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {recentPredictions.map((prediction, index) => (
                      <div key={index} className="flex items-center justify-between space-x-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            prediction.risk_level === 'High' ? 'bg-red-500' : 
                            prediction.risk_level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <div className="font-medium">{prediction.address}</div>
                            <div className="text-sm text-muted-foreground">
                              {prediction.crime_type} - Risk: {prediction.risk_level} ({(prediction.risk_probability * 100).toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {prediction.timestamp || 'Recent'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent predictions found. Try making a prediction first.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>Detailed view of your prediction history</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading prediction history...</p>
                ) : recentPredictions.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Crime Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Level</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Probability</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {recentPredictions.map((prediction, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{prediction.address}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{prediction.crime_type}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                prediction.risk_level === 'High' ? 'bg-red-100 text-red-800' : 
                                prediction.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {prediction.risk_level}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{(prediction.risk_probability * 100).toFixed(1)}%</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{prediction.timestamp || 'Recent'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No prediction history found. Try making a prediction first.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
