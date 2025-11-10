"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import apiClient from '@/lib/utils/apiClient';
import { useAppSelector } from '@/redux/hooks';

const initialSenderData = {
  nickname: '',
  from_email: '',
  from_name: '',
  reply_to: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

const UsersPage = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [senderData, setSenderData] = useState(initialSenderData);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderData({ ...senderData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.post('http://localhost:8000/api/v1/senders/verify', senderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerified(true);
      setSuccess('Your sender email has been successfully verified!');
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2">
      <h1 className="text-3xl font-bold mb-4">Users Management</h1>
      <p className="text-gray-600 mb-6">Manage your users and sender verification here.</p>
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <div className="w-full flex flex-col items-center gap-2">
          <StatusBadge variant={verified ? 'active' : 'draft'}>
            {verified ? 'Sender Verified' : 'Sender Not Verified'}
          </StatusBadge>
        </div>
        {!verified && (
          <form onSubmit={handleVerify} className="w-full bg-white rounded-lg shadow p-6 space-y-4 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nickname" value={senderData.nickname} onChange={handleChange} required placeholder="Nickname" className="border rounded px-3 py-2 w-full" />
              <input name="from_email" value={senderData.from_email} onChange={handleChange} required placeholder="Sender Email" type="email" className="border rounded px-3 py-2 w-full" />
              <input name="from_name" value={senderData.from_name} onChange={handleChange} required placeholder="Sender Name" className="border rounded px-3 py-2 w-full" />
              <input name="reply_to" value={senderData.reply_to} onChange={handleChange} required placeholder="Reply To Email" type="email" className="border rounded px-3 py-2 w-full" />
              <input name="address" value={senderData.address} onChange={handleChange} required placeholder="Address" className="border rounded px-3 py-2 w-full" />
              <input name="city" value={senderData.city} onChange={handleChange} required placeholder="City" className="border rounded px-3 py-2 w-full" />
              <input name="state" value={senderData.state} onChange={handleChange} required placeholder="State" className="border rounded px-3 py-2 w-full" />
              <input name="zip" value={senderData.zip} onChange={handleChange} required placeholder="ZIP Code" className="border rounded px-3 py-2 w-full" />
              <input name="country" value={senderData.country} onChange={handleChange} required placeholder="Country" className="border rounded px-3 py-2 w-full" />
            </div>
            <Button variant="primary" className="w-full" type="submit" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify Sender Email'}
            </Button>
            <p className="text-xs text-gray-500 text-center">You must verify your sender address before you can send emails.</p>
          </form>
        )}
        {error && (
          <div className="fixed top-6 right-6 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded shadow z-50 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="fixed top-6 right-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow z-50 animate-fade-in">
            {success}
          </div>
        )}
        {verified && (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 w-full text-center font-semibold shadow-sm">
              Your sender email has been successfully verified!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
