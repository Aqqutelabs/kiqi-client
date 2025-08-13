'use client';
import { useRouter } from 'next/navigation';

import { Lock } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import AuthLayout from '@/components/ui/layout/AuthLayout';

const ConfirmPasswordPage = () => {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to update password
        router.push('/auth/login');
    }

    return (
        <AuthLayout>
            <Card>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your new password</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField label="Password" id="password" type="password" placeholder="Enter new password" icon={<Lock size={18} className="text-gray-400"/>} required />
                    <FormField label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm new password" icon={<Lock size={18} className="text-gray-400"/>} required />
                    <Button type="submit" className="w-full">Log in</Button>
                </form>
            </Card>
        </AuthLayout>
    );
}

export default ConfirmPasswordPage;