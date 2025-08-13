'use client';
import React, { useState } from 'react';

import { Plus, Wand2, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';

const campaignsData = [
    // Create more mock data to fill the table (at least 12 rows)
    { name: 'My emails', status: 'active', audience: 450, deliveries: 450, opens: 300, clicks: 40, date: '10-04-2025' },
    { name: 'Q4 Promo', status: 'active', audience: 1250, deliveries: 1245, opens: 950, clicks: 120, date: '10-04-2025' },
    { name: 'Newsletter Nov.', status: 'active', audience: 4500, deliveries: 4490, opens: 2100, clicks: 350, date: '10-03-2025' },
    { name: 'BFCM Teaser', status: 'scheduled', audience: 8000, deliveries: 0, opens: 0, clicks: 0, date: '10-15-2025' },
    //... add more for a full list
    { name: 'Onboarding Series', status: 'completed', audience: 600, deliveries: 600, opens: 450, clicks: 95, date: '09-28-2025' },
];

const TABS = ['All', 'Active', 'Scheduled', 'Completed'];

const EmailCampaignsListPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    const handleCreateCampaignClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
        <DashboardLayout>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Email Campaigns</h2>
                </div>

                <Card>
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            {/* Tabs */}
                            <div className="p-1 bg-gray-100 rounded-lg flex space-x-1 w-full sm:w-auto">
                                {TABS.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md flex-1 sm:flex-initial transition-colors ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >{tab}</button>
                                ))}
                            </div>
                            
                            {/* Search and Actions */}
                            <div className="flex items-center gap-2">
                                <div className="relative flex-grow">
                                    <Input icon={<Search size={16} className="text-gray-400" />} placeholder="Search anything that comes to mind"/>
                                </div>
                                <Button variant="tertiary" className="!bg-white border border-gray-300 !text-gray-700 hidden md:inline-flex"><Filter size={16} className="mr-2"/> Filters</Button>
                                <Button onClick={handleCreateCampaignClick}><Plus size={16} className="mr-2"/>Create Campaign</Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm">
                             {/* Table Head */}
                            <thead className="text-left text-gray-600"><tr>{['Name', 'Status', 'Audience', 'Deliveries', 'Opens', 'Clicks', 'Date', 'Date'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaignsData.map((campaign, i) => (
                                    <tr key={i} className="text-gray-700">
                                        <td className="p-3 font-medium">{campaign.name}</td>
                                        <td className="p-3"><StatusBadge variant={campaign.status as any}>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</StatusBadge></td>
                                        <td className="p-3">{campaign.audience}</td>
                                        <td className="p-3">{campaign.deliveries}</td>
                                        <td className="p-3">{campaign.opens}</td>
                                        <td className="p-3">{campaign.clicks}</td>
                                        <td className="p-3">{campaign.date}</td>
                                        <td className="p-3"><Button size="sm">Add Email</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200">
                        <Pagination currentPage={1} totalPages={10} onPageChange={(p) => console.log(p)}/>
                    </div>
                </Card>
            </main>
        </DashboardLayout>
        
        {/* The Modal for creating a campaign */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Create email campaign</h3>
                <div className="space-y-4">
                    <Link href="/dashboard/email-campaigns/create?ai=true" 
                          className="w-full flex items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium transition-colors"
                          onClick={() => setIsModalOpen(false)} // Close modal on click
                    >
                        <Wand2 size={20} className="mr-3 text-purple-500" />
                        Create with KiQi AI
                    </Link>
                     <Link href="/dashboard/email-campaigns/create"
                           className="w-full flex items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium transition-colors"
                           onClick={() => setIsModalOpen(false)}
                     >
                        <Plus size={20} className="mr-3 text-blue-500" />
                        Create Manually
                    </Link>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default EmailCampaignsListPage;