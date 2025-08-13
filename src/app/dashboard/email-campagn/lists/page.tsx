'use client';
import React from 'react';
import Link from 'next/link';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Textarea } from '@/components/ui/Textarea';

const emailLists = [
    { id: '1', name: 'My emails', date: '10-04-2025', count: 45 },
    { id: '2', name: 'Podcast Subscribers', date: '09-28-2025', count: 120 },
];

const ManageEmailListPage = () => {
    return (
    <DashboardLayout>
      <PageHeader title="Manage Email List" backLink="/dashboard/email-campaigns/create" />
      
      <Card className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Create Email List</h3>
        <form className="space-y-4">
          <div>
            <label className="label">Name of List</label>
            <Input placeholder="Enter a name for this list" />
          </div>
          <div>
            <label className="label">Add Email Address (Option 1)</label>
            <Textarea placeholder="Separate each Email with a comma..." rows={4}/>
          </div>
          <Button type="submit">Create Email List</Button>
        </form>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Email Lists</h3>
          <span className="text-sm text-gray-500">Total Lists: {emailLists.length}</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead> ... </thead>
            <tbody className="divide-y divide-gray-200">
              {emailLists.map(list => (
                <tr key={list.id}>
                  <td className="td-cell">{list.name}</td>
                  <td className="td-cell">{list.date}</td>
                  <td className="td-cell">{list.count}</td>
                  <td className="td-cell">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/email-campaigns/lists/${list.id}`}>
                        <Button className="!bg-cyan-500 hover:!bg-cyan-600 text-white" size="sm">View List</Button>
                      </Link>
                      <Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16} /></Button>
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
export default ManageEmailListPage;