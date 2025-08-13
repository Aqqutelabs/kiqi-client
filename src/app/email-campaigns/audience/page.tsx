'use client';
import React, { useState } from 'react';
import { Trash2, Search, Filter, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import Checkbox from '@/components/ui/CheckBox';
// import { Checkbox } from '@/components/ui/Checkbox';

const subscribers = Array.from({ length: 12 }, (_, i) => ({
    id: `sub-${i + 1}`,
    name: 'John Paul',
    email: 'johnpaul@gmail.com',
    subscribed: '1 month ago'
}));

const AudiencePage = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(subscribers.map(sub => sub.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedRows.length === subscribers.length && subscribers.length > 0;

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <PageHeader title="Audience" backLink="/dashboard/email-campaigns" />

        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-2">
                    <Select>
                        <option>New Subs</option>
                    </Select>
                    <Button variant="tertiary" className="!bg-blue-50 border border-blue-200 !text-blue-600"><Plus size={16}/> New List</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="tertiary" className="!bg-white border"><Search size={16} /></Button>
                    <Button variant="tertiary" className="!bg-white border"><Filter size={16}/> Filters</Button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100/70">
                        <tr className="text-left text-gray-600">
                            <th className="p-3 w-12"><Checkbox id="select-all" checked={isAllSelected} onChange={handleSelectAll} label=""/></th>
                            <th className="p-3 font-medium">Name</th>
                            <th className="p-3 font-medium">Email Address</th>
                            <th className="p-3 font-medium">Subscribed</th>
                            <th className="p-3 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {subscribers.map(sub => (
                            <tr key={sub.id} className="text-gray-700">
                                <td className="p-3"><Checkbox id={`cb-${sub.id}`} checked={selectedRows.includes(sub.id)} onChange={() => handleSelectRow(sub.id)} label=""/></td>
                                <td className="p-3">{sub.name}</td>
                                <td className="p-3">{sub.email}</td>
                                <td className="p-3">{sub.subscribed}</td>
                                <td className="p-3 text-center">
                                    <Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16} /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
             <div className="p-4 border-t flex flex-wrap gap-4 justify-between items-center">
                <Button>Send Campaign</Button>
                <Pagination currentPage={1} totalPages={10} onPageChange={(p) => {}} />
            </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AudiencePage;