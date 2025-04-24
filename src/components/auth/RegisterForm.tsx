import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import AvatarSelector from '@/components/AvatarSelector';
import SelectedAvatar from '@/components/SelectedAvatar';
import PasswordInput from './PasswordInput';
import { api } from '@/lib/api';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Call the register API with just the username
      const result = await api.register(userName);
      
      toast({
        title: "Registration successful",
        description: `Account created for ${result.username}`,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    
    if (numbers.length > 0) {
      formatted = '+' + numbers.substring(0, 3);
      if (numbers.length > 3) {
        formatted += ' ' + numbers.substring(3, 6);
      }
      if (numbers.length > 6) {
        formatted += ' ' + numbers.substring(6, 9);
      }
      if (numbers.length > 9) {
        formatted += ' ' + numbers.substring(9, 12);
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  return (
    <div className="glass-form p-8">
      <h2 className="text-2xl font-semibold mb-6">Create an account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <SelectedAvatar 
            selectedIndex={selectedAvatarIndex} 
            userName={userName}
          />
          <div className="mt-6 w-full">
            <Label>Choose your avatar</Label>
            <div className="mt-2">
              <AvatarSelector
                selectedIndex={selectedAvatarIndex}
                onSelect={setSelectedAvatarIndex}
                userName={userName}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Full Name</Label>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+255 XXX XXX XXX"
            value={phone}
            onChange={handlePhoneChange}
            className="auth-input"
            required
          />
        </div>
        
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          required
        />
        
        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
