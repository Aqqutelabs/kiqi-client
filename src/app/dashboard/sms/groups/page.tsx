'use client';
import React from 'react';
import Link from 'next/link';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import { PageHeader } from '@/components/molecules/PageHeader';
// import { Card } from '@/components/atoms/Card';
// import { Button } from '@/components/atoms/Button';
// import { Input } from '@/components/atoms/Input';
import { Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';

const groups = [
    { id: '1', name: 'Group 1', date: '10-04-2025', count: 45 },
    { id: '2', name: 'Group 2', date: '10-04-2025', count: 45 },
    { id: '3', name: 'Group 3', date: '10-04-2025', count: 45 },
];

const ManageRecipientGroupsPage = () => {
    return (
        <DashboardLayout>
            <PageHeader title="Manage Recipient Groups" backLink="/dashboard/sms/send" />
            <Card className="mb-8">
                {/* Form to create a recipient group */}
                {/* ... Similar to Create Sender ID form ... */}
                <h3 className="text-lg font-semibold mb-4">Create a Recipient Group</h3>
                 <form className="space-y-4">
                    <div>
                        <label className="label">Name of Group</label>
                        <Input placeholder="Enter a name for this recipient group" />
                    </div>
                     <div className="flex gap-2">
                        <Input className="flex-grow" placeholder="Enter Recipient's Number here. Separate with comma..." />
                        <Button type="button">Select from contacts</Button>
                    </div>
                     <Button type="submit">Create Recipient Group</Button>
                 </form>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recipient Groups</h3>
                    <span className="text-sm text-gray-500">Total Groups: {groups.length}</span>
                </div>
                {/* Table for groups */}
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                         <tr>
                            <th className="th-cell">Group Name</th>
                            <th className="th-cell">Date Created</th>
                            <th className="th-cell">Total Contacts</th>
                            <th className="th-cell text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {groups.map(item => (
                             <tr key={item.id}>
                                 <td className="td-cell font-medium">{item.name}</td>
                                 <td className="td-cell">{item.date}</td>
                                 <td className="td-cell">{item.count}</td>
                                 <td className="td-cell">
                                     <div className="flex items-center justify-end gap-2">
                                         <Link href={`/dashboard/sms/groups/${item.id}`}>
                                            <Button className="!bg-cyan-500 hover:!bg-cyan-600" size="sm">View Group</Button>
                                         </Link>
                                         <Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16} /></Button>
                                     </div>
                                 </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </DashboardLayout>
    );
};
export default ManageRecipientGroupsPage;