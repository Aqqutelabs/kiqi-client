'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Select } from '@/components/ui/Select';
import SimpleFileInput from '@/components/ui/SimpleFileInput';


const CreateCampaignPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Create a Campaign" backLink="/dashboard/overview" />
      <Card>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Campaign Name</label>
              <Input placeholder="Enter campaign name" />
            </div>
            <div>
              <label className="label">Sender</label>
              <div className="flex gap-2">
                <Select className="flex-grow">
                  <option>Select sender email</option>
                </Select>
                <Link href="/dashboard/email-campaigns/create-sender">
                    <Button type="button">Register new sender email</Button>
                </Link>
              </div>
            </div>
            <div>
              <label className="label">From</label>
              <Input placeholder="Enter the name of the Sender..." />
            </div>
            <div className="md:col-span-2">
              <label className="label">To</label>
              <div className="flex gap-2">
                <Select className="flex-grow">
                  <option>Select from email list</option>
                </Select>
                 <Link href="/dashboard/email-campaigns/lists">
                    <Button type="button">Create a new Email list</Button>
                </Link>
              </div>
            </div>
            <div>
              <SimpleFileInput label="Upload Email Address Files (Optional)" id="upload-files" />
            </div>
            <div>
              <label className="label">Enter Recipients Email Address (Optional)</label>
              <Input placeholder="Enter recipients' emails, separated by commas" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Add a subject line for this campaign</label>
              <Input placeholder="Enter a subject line" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            <Button type="submit">Send Now</Button>
            <Button type="button" variant="secondary">Save as Draft</Button>
            <Button type="button" className="!bg-cyan-500 hover:!bg-cyan-600">Schedule for Later</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};
export default CreateCampaignPage;
