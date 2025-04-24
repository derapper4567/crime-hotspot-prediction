// API base URL - ensure this matches your Django server
const API_BASE_URL = 'http://localhost:8000';

// API endpoints
const ENDPOINTS = {
  LOGIN: '/myapp/api/login/',
  REGISTER: '/myapp/api/register/',
  PREDICT: '/myapp/api/predict/',
  CRIME_TYPES: '/myapp/api/crime-types/',
  RECENT_PREDICTIONS: '/myapp/api/recent-predictions/',
  DETECT_SMS: '/myapp/api/detect-sms/',
};

// Improved helper function to handle network errors
const handleNetworkError = (error: any, operation: string) => {
  console.error(`Network error during ${operation}:`, error);
  
  // Check if it's a network error (server not running or unreachable)
  if (error instanceof TypeError && 
      (error.message.includes('Failed to fetch') || 
       error.message.includes('Network request failed'))) {
    return {
      error: `Network error: Please check if the server is running at ${API_BASE_URL}`
    };
  }
  
  // Handle CORS errors
  if (error instanceof DOMException && error.name === 'NetworkError') {
    return {
      error: `CORS error: The server at ${API_BASE_URL} is not allowing requests from this origin`
    };
  }
  
  return {
    error: error instanceof Error ? error.message : `Error during ${operation}`
  };
};

// API service
export const api = {
  // Authentication
  login: async (username: string): Promise<any> => {
    try {
      console.log(`Attempting to login with username: ${username}`);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });
      
      console.log(`Login response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Login failed with status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (username: string): Promise<any> => {
    try {
      console.log(`Attempting to register with username: ${username}`);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });
      
      console.log(`Register response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Registration failed with status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  // Crime prediction
  predict: async (address: string, crimeType: string) => {
    try {
      console.log(`Making prediction request to ${API_BASE_URL}${ENDPOINTS.PREDICT}`);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PREDICT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          address,
          crime_type: crimeType
        }),
      });
      
      console.log(`Prediction response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Prediction failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Successfully parsed response JSON:", data);
      return data;
    } catch (error) {
      console.error("Error in predict method:", error);
      return handleNetworkError(error, 'prediction');
    }
  },
  
  // Get crime types
  getCrimeTypes: async (): Promise<string[]> => {
    try {
      console.log(`Fetching crime types from ${API_BASE_URL}${ENDPOINTS.CRIME_TYPES}`);
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CRIME_TYPES}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log(`Crime types response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch crime types: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Crime types response data:", data);
      
      if (!data.crime_types || !Array.isArray(data.crime_types)) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format: crime_types array not found");
      }
      
      return data.crime_types;
    } catch (error) {
      console.error("Error fetching crime types:", error);
      handleNetworkError(error, 'fetching crime types');
      return [];
    }
  },
  
  // Get recent predictions
  getRecentPredictions: async () => {
    try {
      console.log(`Fetching recent predictions from ${API_BASE_URL}${ENDPOINTS.RECENT_PREDICTIONS}`);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.RECENT_PREDICTIONS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log(`Recent predictions response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch recent predictions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Recent predictions response data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching recent predictions:", error);
      return handleNetworkError(error, 'fetching recent predictions');
    }
  },

  // Add a method to get analytics data if needed
  getAnalyticsData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/myapp/api/analytics/`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch analytics: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      console.log(`Testing connection to ${API_BASE_URL}`);
      const response = await fetch(`${API_BASE_URL}/myapp/api/health-check/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        return { 
          success: false, 
          message: `Server responded with status: ${response.status}` 
        };
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      return handleNetworkError(error, 'connection test');
    }
  },

  // SMS spam detection
  detectSMS: async (message: string) => {
    try {
      console.log(`Sending SMS detection request to ${API_BASE_URL}${ENDPOINTS.DETECT_SMS}`);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DETECT_SMS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });
      
      console.log(`SMS detection response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `SMS detection failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("SMS detection result:", result);
      return result;
    } catch (error) {
      console.error("Error detecting SMS spam:", error);
      return {
        message,
        is_spam: false,
        spam_probability: 0,
        classification: 'Unknown',
        recommendation: 'Could not analyze this message.'
      };
    }
  },
};
