'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Textarea } from '@/components/ui/Textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserEmailLists } from '@/redux/slices/campaignSlice';
import { useEffect } from 'react';
import { createEmailListWithFiles, clearCreateEmailListStatus } from '@/redux/slices/campaignSlice';
import { toast } from 'react-hot-toast';

const ManageEmailListPage = () => {
    const dispatch = useAppDispatch();
    const { createEmailListStatus, createEmailListError, createEmailListData, userCampaigns, status, error } = useAppSelector(state => state.campaign);
    const [form, setForm] = React.useState({
        email_listName: '',
        emails: '',
        emailFiles: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchUserEmailLists());
    }, [dispatch]);

    // Refetch email lists after successful creation
    useEffect(() => {
        if (createEmailListStatus === 'succeeded') {
            dispatch(fetchUserEmailLists());
        }
    }, [createEmailListStatus, dispatch]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch(clearCreateEmailListStatus());
        try {
            // Parse emails as array of objects: [{ email, fullName? }]
            // Accepts: "email fullName" or just "email"
            const emailsArr = form.emails
                .split(',')
                .map(e => {
                    const [email, ...rest] = e.trim().split(/\s+/);
                    const fullName = rest.join(' ').trim();
                    return fullName ? { email: email.trim(), fullName } : { email: email.trim() };
                })
                .filter(e => e.email);
            const filesArr = form.emailFiles.split(',').map(f => f.trim()).filter(Boolean);
            const result = await dispatch(createEmailListWithFiles({
                email_listName: form.email_listName,
                emails: emailsArr,
                emailFiles: filesArr,
            }));
            if (createEmailListWithFiles.fulfilled.match(result)) {
                toast.success('Email list created successfully!');
                setForm({ email_listName: '', emails: '', emailFiles: '' });
            } else {
                toast.error(result.payload || createEmailListError || 'Failed to create email list');
            }
        } catch (err) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // CSV upload handler (just send file, let backend process)
    const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);
        try {
            const formData = new FormData();
            formData.append('csv', file);
            formData.append('email_listName', form.email_listName || 'Untitled List');
            const result = await dispatch(createEmailListWithFiles(formData));
            if (createEmailListWithFiles.fulfilled.match(result)) {
                setUploadSuccess('CSV uploaded and email list created!');
                setForm({ email_listName: '', emails: '', emailFiles: '' });
                dispatch(fetchUserEmailLists());
            } else {
                setUploadError(result.payload || createEmailListError || 'Failed to create email list');
            }
        } catch (err) {
            setUploadError('Failed to upload CSV');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Sort userCampaigns by createdAt descending
    const sortedCampaigns = Array.isArray(userCampaigns)
        ? [...userCampaigns].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];

    // Add delete handler
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this email list?')) return;
        try {
            await dispatch({ type: 'campaign/deleteEmailList', payload: id });
            dispatch(fetchUserEmailLists());
            toast.success('Email list deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete email list.');
        }
    };

    return (
        <DashboardLayout>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <PageHeader title="Email List" backLink="/email-campaigns" />
                
                <Card className="mb-8 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Create Email List</h3>
                    <form className="space-y-6 max-w-xl" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">List Name</label>
                            <Input name="email_listName" value={form.email_listName} onChange={handleFormChange} placeholder="Enter a name for this email list" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Add Email Address (Option 1)</label>
                            <Textarea name="emails" rows={3} value={form.emails} onChange={handleFormChange} placeholder="Enter email addresses here. Each line: 'email fullName', e.g. john@example.com John Doe, jane@example.com Jane Doe."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Upload Email Address CSV (Option 2)</label>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleCsvUpload}
                                className="block w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        {createEmailListStatus === 'loading' || isSubmitting ? (
                            <div className="text-blue-600">Creating list...</div>
                        ) : null}
                        {createEmailListStatus === 'failed' && createEmailListError && (
                            <div className="text-red-500">{createEmailListError}</div>
                        )}
                        {createEmailListStatus === 'succeeded' && (
                            <div className="text-green-600">Email list created!</div>
                        )}
                        {uploading && <div className="text-blue-600">Uploading CSV...</div>}
                        {uploadError && <div className="text-red-500">{uploadError}</div>}
                        {uploadSuccess && <div className="text-green-600">{uploadSuccess}</div>}
                        <Button type="submit" disabled={isSubmitting || createEmailListStatus === 'loading'}>Create Email List</Button>
                    </form>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Email Lists</h3>
                        <span className="text-sm text-gray-500">Total Lists: {userCampaigns ? userCampaigns.length : 0}</span>
                    </div>
                     <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-gray-100/70"><tr className="text-left text-gray-600">{['Email List Name', 'Date Created', 'Total Emails in List', 'Action'].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {status === 'loading' ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-red-500">{error}</td></tr>
                                ) : userCampaigns && userCampaigns.length > 0 ? (
                                    sortedCampaigns.map((list: any) => (
                                        <tr key={list._id}>
                                            <td className="p-3 font-medium text-gray-800">{list.email_listName}</td>
                                            <td className="p-3 text-gray-500">{list.createdAt ? new Date(list.createdAt).toLocaleDateString() : '-'}</td>
                                            <td className="p-3 text-gray-500">{Array.isArray(list.emails) ? list.emails.length : 0}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/email-campaigns/email-lists/${list._id}`}><Button size="sm" className="!bg-cyan-500 hover:!bg-cyan-600 text-white">View List</Button></Link>
                                                    <Link href={`/email-campaigns/email-lists/${list._id}/edit`}><Button size="sm" variant="secondary">Edit</Button></Link>
                                                    <Button variant="destructive" size="sm" className="!p-2" onClick={() => handleDelete(list._id)}><Trash2 size={16} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No email lists found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </DashboardLayout>
    );
};
export default ManageEmailListPage;