'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import AuthLayout from '@/components/ui/layout/AuthLayout';
import { loginUser } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';

// Assuming Google and Metamask have their own logo components or are SVGs
const GoogleIcon = () => <svg /* ... */ height="20" width="20" />; 
const MetamaskIcon = () => <img src="/metamask-fox.svg" alt="Metamask" className="h-5 w-5" />;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const credentials = Object.fromEntries(formData.entries());
    dispatch(loginUser(credentials)).then((result) => {
        if (loginUser.fulfilled.match(result)) {
            router.push('/dashboard');
        }
    });
  };

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login to KiQi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="primary" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"><GoogleIcon /> <span className="ml-2">Google</span></Button>
            <Button variant="secondary"><MetamaskIcon /> <span className="ml-2">MetaMask</span></Button>
        </div>
        
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Email Address" id="email" name="email" type="email" placeholder="Enter Email Address" icon={<Mail className="text-gray-400" size={18}/>} required/>
            
            <div className="relative">
                <FormField label="Password" id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter Password" icon={<Lock className="text-gray-400" size={18}/>} required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#3366FF] focus:ring-[#3366FF]" />
                    <span className="ml-2 text-gray-600">Remember Me</span>
                </label>
                <Link href="/auth/reset-password" className="font-medium text-[#3366FF] hover:underline">Forgot Password?</Link>
            </div>
          
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Logging in...' : 'Log In'}
            </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Do not have an account? <Link href="/auth/signup" className="font-medium text-[#3366FF] hover:underline">Sign Up</Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;