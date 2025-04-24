
import React from 'react';
import { CheckCircle } from 'lucide-react';

const RegisterSidebar = () => {
  return (
    <div className="hidden sm:flex flex-1 bg-gradient-to-br from-crime-dark via-crime-accent to-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-auth-pattern opacity-10"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
        <div className="glass-card p-8 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Join Ulinzi Kitaa</h2>
          <p className="mb-6">
            Help make our community safer by joining our network of users. Together we can prevent security threats through early detection and prediction.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
              <span>Access real-time security predictions</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
              <span>Connect to surveillance cameras</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
              <span>Receive alerts about nearby incidents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSidebar;
