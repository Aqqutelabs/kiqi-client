'use client';
import React, { useState } from 'react';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import { PageHeader } from '@/components/molecules/PageHeader';
// import { Card } from '@/components/atoms/Card';
// import { Button } from '@/components/atoms/Button';
// import { Input } from '@/components/atoms/Input';
// import { Select } from '@/components/atoms/Select';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Select } from '@/components/ui/Select';
import { useDispatch, useSelector } from 'react-redux';
import { createSender, fetchSenders } from '@/redux/slices/campaignSlice';

// Notification component (simple inline for demo)
const Notification = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{message}<button className="ml-4 text-white" onClick={onClose}>×</button></div>
);

const senderEmails = [
  { id: '1', email: 'Myemail@email.com', date: '10-04-2025', type: 'Campaign', name: 'Emmanuel Jones' },
];

const CreateSenderEmailPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [sender, setSender] = useState('');
  const [type, setType] = useState('campaign');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const fullState = useSelector((state: any) => state);
  console.log('Full Redux State:', fullState);
  const status = useSelector((state: any) => state.campaign?.status ?? 'idle');
  const error = useSelector((state: any) => state.campaign?.error ?? null);
  const senders = useSelector((state: any) => state.campaign?.senders?.data ?? []);
  console.log('Senders:', senders);

  React.useEffect(() => {
    setFetchLoading(true);
    dispatch<any>(fetchSenders()).finally(() => setFetchLoading(false));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const resultAction = await dispatch<any>(createSender({ email, sender, type }));
      if (createSender.fulfilled.match(resultAction)) {
        setNotification({ message: 'Sender email created successfully!', type: 'success' });
        setEmail(''); setSender(''); setType('campaign');
        // Refetch senders after successful creation
        setFetchLoading(true);
        dispatch<any>(fetchSenders()).finally(() => setFetchLoading(false));
      } else {
        setNotification({ message: resultAction.payload?.message || 'Failed to create sender email', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'An unexpected error occurred', type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <PageHeader title="Create a sender email" backLink="/dashboard/email-campaigns" />
        <Card className="mb-8 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Submit sender email</h3>
          <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
              <Input type="email" placeholder="Enter Sender Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select value={type} onChange={e => setType(e.target.value)} required>
                <option value="campaign">Campaign</option>
                <option value="message">Message</option>
                <option value="single">Single</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
              <Input placeholder="Enter a sender e.g company name" value={sender} onChange={e => setSender(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={status === 'loading' || submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit sender Email'}
            </Button>
          </form>
        </Card>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sender Emails</h3>
            <span className="text-sm text-gray-500">Total Emails: {fetchLoading ? 'Loading...' : senders.length}</span>
          </div>
          <div className="w-full overflow-x-auto">
            {fetchLoading ? (
              <div className="text-center py-8">Loading sender emails...</div>
            ) : (
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100/70">
                  <tr className="text-left text-gray-600">
                    <th className="p-3 font-medium">Sender Email</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Sender</th>
                    <th className="p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {senders.map((row: any) => (
                    <tr key={row.id}>
                      <td className="p-3">{row.senderEmail}</td>
                      <td className="p-3">{row.type}</td>
                      <td className="p-3">{row.senderName}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="tertiary" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
     </main>
    </DashboardLayout>
  );
};
export default CreateSenderEmailPage;