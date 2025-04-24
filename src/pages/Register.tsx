
import React from 'react';
import RegisterHeader from '@/components/auth/RegisterHeader';
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterSidebar from '@/components/auth/RegisterSidebar';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <RegisterHeader />
          <RegisterForm />
        </div>
      </div>
      <RegisterSidebar />
    </div>
  );
};

export default Register;
