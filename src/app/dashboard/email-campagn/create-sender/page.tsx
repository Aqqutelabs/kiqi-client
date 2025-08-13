'use client'; // Required for client-side interactions like state and event handlers
import React from 'react';
import Link from 'next/link';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Select } from '@/components/ui/Select';

const senderEmails = [
  { id: '1', email: 'Myemail@email.com', date: '10-04-2025', type: 'Campaign', name: 'Emmanuel Jones', status: '-------' },
];

const CreateSenderEmailPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Create a sender email" backLink="/dashboard/overview" />

      <Card className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Submit sender email</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
            <Input type="email" placeholder="Enter Sender Email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <Select>
              <option>Campaign</option>
              <option>Transactional</option>
            </Select>
          </div>
          <Button type="submit" className="w-full md:w-auto">Submit sender Email</Button>
        </form>
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sender Emails</h3>
          <span className="text-sm text-gray-500">Total Emails: {senderEmails.length}</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Sender Email</th>
                <th className="th-cell">Date Created</th>
                <th className="th-cell">Type</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {senderEmails.map(row => (
                <tr key={row.id}>
                  <td className="td-cell">{row.email}</td>
                  <td className="td-cell">{row.date}</td>
                  <td className="td-cell">{row.type}</td>
                  <td className="td-cell">{row.status}</td>
                  <td className="td-cell">
                    <div className="flex items-center gap-2">
                      <Button variant="tertiary" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm" className="!p-2">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};
export default CreateSenderEmailPage;

// Helper classes for table styling (add to your globals.css)
/*
  @layer components {
    .th-cell { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
    .td-cell { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700; }
  }
*/