'use client';
import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Textarea } from '@/components/ui/Textarea';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { FileUpload } from '@/components/ui/FileUpload';
// import { Input } from '@/components/ui/Input';
// import DashboardLayout from '@/components/ui/layout/DashboardLayout';
// import { PageHeader } from '@/components/ui/layout/PageHeader';
// import { Textarea } from '@/components/ui/Textarea';

const emailListsData = [
  { id: 'new-subs', name: 'New Subs', date: '10-04-2025', count: 45 },
  { id: 'product-user', name: 'NYX Product user', date: '10-04-2025', count: 45 },
  { id: 'my-emails', name: 'My emails', date: '10-04-2025', count: 45 },
];

const ManageEmailListPage = () => {
    return (
        <DashboardLayout>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <PageHeader title="Email List" backLink="/dashboard/email-campaigns" />
                
                <Card className="mb-8 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Create Email List</h3>
                    <form className="space-y-6 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium mb-1">List Name</label>
                            <Input placeholder="Enter a name for this email list" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Add Email Address (Option 1)</label>
                            <Textarea rows={3} placeholder="Enter email addresses here. Separate each Email with a comma, e.g. xxx@xxx.com,xxx@xxx.com."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Upload Email Address Files (Option 2)</label>
                            <FileUpload />
                        </div>
                        <Button type="submit">Create Email List</Button>
                    </form>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Email Lists</h3>
                        <span className="text-sm text-gray-500">Total Lists: {emailListsData.length}</span>
                    </div>
                     <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-gray-100/70"><tr className="text-left text-gray-600">{['Email List Name', 'Date Created', 'Total Emails in List', 'Action'].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-100">{emailListsData.map(list => (
                                <tr key={list.id}>
                                    <td className="p-3 font-medium text-gray-800">{list.name}</td>
                                    <td className="p-3 text-gray-500">{list.date}</td>
                                    <td className="p-3 text-gray-500">{list.count}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/email-lists/${list.id}`}><Button size="sm" className="!bg-cyan-500 hover:!bg-cyan-600 text-white">View List</Button></Link>
                                            <Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </DashboardLayout>
    );
};
export default ManageEmailListPage;