'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import { PageHeader } from '@/components/molecules/PageHeader';
// import { Button } from '@/components/atoms/Button';
// import { Input } from '@/components/atoms/Input';
import { Trash2, Search, Filter, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import BASE_URL from '@/lib/utils/baseUrl';

const EmailListDetailPage = () => {
    const params = useParams();
    const { listId } = params;
    const [list, setList] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get token from persisted Redux state
                let token = null;
                if (typeof window !== 'undefined') {
                    const persistRoot = localStorage.getItem('persist:root');
                    if (persistRoot) {
                        const auth = JSON.parse(JSON.parse(persistRoot).auth || '{}');
                        token = auth.token;
                    }
                }
                const res = await fetch(`${BASE_URL}/api/v1/email-lists/${listId}`,
                    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
                );
                const data = await res.json();
                if (data.error) {
                    setError('Failed to fetch list details');
                    setList(null);
                } else {
                    setList(data.data);
                }
            } catch (err) {
                setError('Failed to fetch list details');
                setList(null);
            } finally {
                setLoading(false);
            }
        };
        if (listId) fetchList();
    }, [listId]);

    return (
         <DashboardLayout>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
                <PageHeader title={list ? list.email_listName : 'Email List'} backLink="/dashboard/email-lists" />
                <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col">
                    <div className="p-4 border-b flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Button variant="tertiary" className="!bg-white border font-semibold !text-gray-800">{list ? `${list.email_listName} (${Array.isArray(list.emails) ? list.emails.length : 0})` : 'Loading...'} <ChevronDown size={16} className="ml-2"/></Button>
                            <Button variant="tertiary" className="!bg-white border"><Plus size={16}/> Add Email</Button>
                            <Button variant="tertiary" className="!bg-blue-50 border border-blue-200 !text-blue-600"><Plus size={16}/> Create new list</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input icon={<Search size={16} />} placeholder="Search email" className="h-9"/>
                            <Button variant="tertiary" className="!bg-white border !text-gray-700 h-9"><Filter size={16}/> Filters</Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-blue-600">Loading...</div>
                        ) : error ? (
                            <div className="p-8 text-center text-red-500">{error}</div>
                        ) : list && Array.isArray(list.emails) && list.emails.length > 0 ? (
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100/70"><tr className="text-left text-gray-600">{['Email Address', 'Full Name', 'Date Added', 'Action'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {list.emails.map((sub: any, i: number) => (
                                        <tr key={sub._id || i}>
                                            <td className="p-3">{sub.email || Object.values(sub).join('')}</td>
                                            <td className="p-3">{sub.fullName || '-'}</td>
                                            <td className="p-3">{list.createdAt ? new Date(list.createdAt).toLocaleDateString() : '-'}</td>
                                            <td className="p-3"><div className="flex items-center gap-2"><Button size="sm" className="!bg-cyan-500 hover:!bg-cyan-600 text-white">Edit Email</Button><Button variant="destructive" size="sm" className="!p-2"><Trash2 size={16}/></Button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">No subscribers found.</div>
                        )}
                    </div>
                </div>
            </main>
         </DashboardLayout>
    );
};

export default EmailListDetailPage;