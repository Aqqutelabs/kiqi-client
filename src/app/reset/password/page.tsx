'use client';
import { useRouter } from 'next/navigation';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import AuthLayout from '@/components/ui/layout/AuthLayout';

const ResetPasswordPage = () => {
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to send reset link/code
        router.push('/auth/reset-password/verify');
    }
    return (
        <AuthLayout>
            <Card>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your Email Address</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField label="Email Address" id="email" type="email" placeholder="Email Address" icon={<Mail size={18} className="text-gray-400"/>} required />
                    <Button type="submit" className="w-full">Next</Button>
                </form>
            </Card>
        </AuthLayout>
    );
}

export default ResetPasswordPage;