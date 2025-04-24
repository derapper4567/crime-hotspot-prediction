import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Map as MapIcon, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`Submitting login for username: ${username}`);
      const result = await api.login(username);
      console.log('Login successful:', result);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.username}!`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error in component:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <Shield className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Ulinzi Kitaa</h1>
          </div>
          
          <div className="glass-form p-8">
            <h2 className="text-2xl font-semibold mb-6">Welcome back</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="yourusername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-primary" />
                  <span className="text-sm">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden sm:flex flex-1 bg-gradient-to-br from-crime-dark via-crime-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-auth-pattern opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <div className="glass-card p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Crime Prediction & Detection</h2>
            <p className="mb-6">
              Ulinzi Kitaa's advanced system for crime prediction and detection using modern technology and data analytics.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <MapIcon className="h-6 w-6" />
              </div>
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <CameraIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
