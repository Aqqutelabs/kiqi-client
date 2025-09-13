'use client';
import React, { useState } from 'react';

import { Plus, Wand2, Filter, Search, Mail, FileText, Users, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createEmailListWithFiles, clearCreateEmailListStatus, fetchUserEmailLists, startEmailCampaign } from '@/redux/slices/campaignSlice';
import { toast } from 'react-hot-toast';

const TABS = ['All', 'Active', 'Scheduled', 'Completed'];

const EmailCampaignsListPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [form, setForm] = useState({
        email_listName: '',
        emails: '',
        emailFiles: '',
    });
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [campaignForm, setCampaignForm] = useState({
      campaignName: '',
      subject: '',
      body: '',
    });
    const dispatch = useAppDispatch();
    const {
        createEmailListStatus,
        createEmailListError,
        createEmailListData,
        userCampaigns,
        status,
        error
    } = useAppSelector(state => state.campaign);

    React.useEffect(() => {
        dispatch(fetchUserEmailLists());
    }, [dispatch]);

    const handleCreateCampaignClick = () => {
        setIsModalOpen(true);
        dispatch(clearCreateEmailListStatus());
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createEmailListWithFiles({
            email_listName: form.email_listName,
            emails: form.emails.split(',').map(e => e.trim()).filter(Boolean),
            emailFiles: form.emailFiles.split(',').map(f => f.trim()).filter(Boolean),
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm({ email_listName: '', emails: '', emailFiles: '' });
        dispatch(clearCreateEmailListStatus());
    };

    const handleOpenStartModal = (listId: string) => {
      setSelectedListId(listId);
      setIsStartModalOpen(true);
      setCampaignForm({ campaignName: '', subject: '', body: '' });
    };

    const handleStartCampaignChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCampaignForm({ ...campaignForm, [e.target.name]: e.target.value });
    };

    const handleStartCampaign = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedListId) return;
      const result = await dispatch(startEmailCampaign({
        campaignName: campaignForm.campaignName,
        emailListId: selectedListId,
        subject: campaignForm.subject,
        body: campaignForm.body,
      }));
      if (startEmailCampaign.fulfilled.match(result)) {
        toast.success('Campaign started and emails sent!');
        setIsStartModalOpen(false);
      } else {
        toast.error(result.payload || 'Failed to start campaign');
      }
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
                            <thead className="text-left text-gray-600"><tr>{['Name', 'Status', 'Audience', 'Deliveries', 'Opens', 'Clicks', 'Date', 'Action'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {status === 'loading' ? (
                                    <tr><td colSpan={8} className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={8} className="p-4 text-center text-red-500">{error}</td></tr>
                                ) : userCampaigns && userCampaigns.length > 0 ? (
                                    userCampaigns.map((campaign: any, i: number) => (
                                      <tr key={campaign._id || i} className="text-gray-700">
                                        <td className="p-3 font-medium flex items-center gap-2"><Mail className="text-blue-500" size={16}/>{campaign.email_listName}</td>
                                        <td className="p-3"><StatusBadge variant="active">Active</StatusBadge></td>
                                        <td className="p-3">{campaign.emails?.length || 0}</td>
                                        <td className="p-3">{campaign.emails?.length || 0}</td>
                                        <td className="p-3">-</td>
                                        <td className="p-3">-</td>
                                        <td className="p-3">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : '-'}</td>
                                        <td className="p-3 flex gap-2">
                                          <Button size="sm" variant="primary" onClick={() => handleOpenStartModal(campaign._id)}><Wand2 className="mr-1" size={16}/>Start Campaign</Button>
                                        </td>
                                      </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={8} className="p-4 text-center text-gray-500">No campaigns found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200">
                        <Pagination currentPage={1} totalPages={1} onPageChange={(p) => console.log(p)}/>
                    </div>
                </Card>
            </main>
        </DashboardLayout>
        {/* The Modal for creating a campaign */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <Users className="text-blue-500" /> Create Email List
                </h3>
                <form className="space-y-4 text-left" onSubmit={handleCreateList}>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FileText size={16}/> List Name</label>
                    <Input name="email_listName" value={form.email_listName} onChange={handleFormChange} placeholder="e.g. Tech Conference Attendees 2025" required icon={<FileText size={16} className="text-gray-400"/>}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Mail size={16}/> Emails (comma separated)</label>
                    <Input name="emails" value={form.emails} onChange={handleFormChange} placeholder="john@example.com, jane@example.com" required icon={<Mail size={16} className="text-gray-400"/>}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FileText size={16}/> File URLs (comma separated)</label>
                    <Input name="emailFiles" value={form.emailFiles} onChange={handleFormChange} placeholder="https://example.com/file.csv" icon={<FileText size={16} className="text-gray-400"/>}/>
                  </div>
                  {createEmailListError && <div className="text-red-500 flex items-center gap-1"><XCircle size={16}/>{createEmailListError}</div>}
                  {createEmailListStatus === 'succeeded' && <div className="text-green-600 flex items-center gap-1"><CheckCircle2 size={16}/> Email list created!</div>}
                  <Button type="submit" className="w-full" disabled={createEmailListStatus === 'loading'}>
                    {createEmailListStatus === 'loading' ? <><Loader2 className="animate-spin mr-2 inline"/> Creating...</> : 'Create List'}
                  </Button>
                </form>
            </div>
        </Modal>
        {/* Start Campaign Modal */}
        <Modal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)}>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <Wand2 className="text-blue-500" /> Start Email Campaign
            </h3>
            <form className="space-y-4 text-left" onSubmit={handleStartCampaign}>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FileText size={16}/> Campaign Name</label>
                <Input name="campaignName" value={campaignForm.campaignName} onChange={handleStartCampaignChange} placeholder="e.g. September Newsletter" required icon={<FileText size={16} className="text-gray-400"/>}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Mail size={16}/> Subject</label>
                <Input name="subject" value={campaignForm.subject} onChange={handleStartCampaignChange} placeholder="e.g. Welcome to Our September Newsletter!" required icon={<Mail size={16} className="text-gray-400"/>}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FileText size={16}/> Email Body (HTML)</label>
                <textarea name="body" value={campaignForm.body} onChange={handleStartCampaignChange} placeholder="<h1>Hello!</h1><p>Thank you for subscribing...</p>" required className="w-full rounded-md border-0 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF] min-h-[100px]"/>
              </div>
              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? <><Loader2 className="animate-spin mr-2 inline"/> Starting...</> : 'Start Campaign'}
              </Button>
            </form>
          </div>
        </Modal>
        </>
    );
};

export default EmailCampaignsListPage;