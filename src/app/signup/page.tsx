'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { Mail, Lock, User, Briefcase, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 md:bg-[#3366FF]">
            <div className="w-full max-w-4xl m-4 md:grid md:grid-cols-2 md:gap-10 items-center">
                {/* Left Side Info Panel - Hidden on Mobile */}
                <div className="hidden md:flex flex-col text-white space-y-8 p-4">
                    <h1 className="text-4xl font-bold">Streamline your business with KiQi.</h1>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="mt-1 flex-shrink-0" />
                            <p><span className="font-semibold">Lorem ipsum dolor sit amet</span><br/>Receive detailed insights on all your numbers in real-time.</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="mt-1 flex-shrink-0" />
                            <p><span className="font-semibold">Consectetur adipiscing elit</span><br/>Keep your team members and customers in the loop.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <Card className="p-6 sm:p-8">
                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Register with:</h2>
                     {/* Simplified Social Buttons for brevity */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button variant="primary" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Google</Button>
                        <Button variant="secondary">Connect Wallet</Button>
                    </div>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="First Name" id="firstName" name="firstName" placeholder="First Name" icon={<User size={18} className="text-gray-400"/>}/>
                            <FormField label="Last Name" id="lastName" name="lastName" placeholder="Last Name" icon={<User size={18} className="text-gray-400"/>}/>
                        </div>
                        <FormField label="Email Address" id="email" name="email" type="email" placeholder="Email Address" icon={<Mail size={18} className="text-gray-400"/>}/>
                        <FormField label="Organization/Business Name" id="orgName" name="orgName" placeholder="Organization/Business Name" icon={<Briefcase size={18} className="text-gray-400"/>}/>
                         <div className="relative">
                            <FormField label="Password" id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" icon={<Lock size={18} className="text-gray-400"/>}/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-gray-400">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">Minimum of 8 Characters</p>
                        </div>

                         <Button type="submit" className="w-full !mt-6">Sign Up</Button>
                    </form>

                     <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <Link href="/auth/login" className="font-medium text-[#3366FF] hover:underline">Log In</Link>
                    </p>
                </Card>
            </div>
        </main>
    );
};

export default SignUpPage;