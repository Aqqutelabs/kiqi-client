'use client';
import React, { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createSenderID, fetchSenderIDs } from '@/redux/slices/smsSlice';
import { toast } from 'react-hot-toast';

const CreateSenderIdPage = () => {
  const dispatch = useAppDispatch();
  const { senders, status, error } = useAppSelector((state) => state.sms);
  const [form, setForm] = useState({
    name: '',
    sampleMessage: '',
  });

  useEffect(() => {
    dispatch(fetchSenderIDs());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createSenderID(form)).unwrap();
      toast.success('Sender ID created successfully!');
      setForm({ name: '', sampleMessage: '' }); // Reset form
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create sender ID');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Create a Sender ID" backLink="/dashboard/sms/send" />
      <Card className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Create a Sender ID</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Enter Sender ID</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Enter the name of your Business, Organization"
              required
            />
          </div>
          <div>
            <label className="label">Sample Message</label>
            <Input
              name="sampleMessage"
              value={form.sampleMessage}
              onChange={handleInputChange}
              placeholder="Attach a sample message to this ID"
              required
            />
          </div>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Submit sender ID'
            )}
          </Button>
        </form>
      </Card>
      
      <Card>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sender ID List</h3>
            <span className="text-sm text-gray-500">Total Lists: {senders.length}</span>
         </div>
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="th-cell">Sender ID</th>
                    <th className="th-cell">Date Created</th>
                    <th className="th-cell">Sample Message</th>
                    <th className="th-cell text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {status === 'loading' ? (
                  <tr>
                    <td colSpan={4} className="td-cell text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : status === 'failed' ? (
                  <tr>
                    <td colSpan={4} className="td-cell text-center text-red-500">
                      {error || 'Failed to load sender IDs'}
                    </td>
                  </tr>
                ) : senders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="td-cell text-center text-gray-500">
                      No sender IDs found
                    </td>
                  </tr>
                ) : (
                  senders.map((sender) => (
                    <tr key={sender.id}>
                      <td className="td-cell font-medium">{sender.name}</td>
                      <td className="td-cell">
                        {sender.createdAt ? new Date(sender.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="td-cell text-gray-400">{sender.sampleMessage}</td>
                      <td className="td-cell">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="tertiary" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm" className="!p-2">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
};
export default CreateSenderIdPage;