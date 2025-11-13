'use client';
import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import FormSection from '@/components/ui/FormSection';

// Helper for form fields with labels
const FormField = ({ label, children, helperText }: { label: string; children: React.ReactNode; helperText?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

const SendBulkSmsPage = () => {
  return (
    <>
      <PageHeader title="Send Bulk Sms" backLink="/dashboard/overview" />
      <div className="space-y-8">
        <FormSection title="Send Bulk Sms">
          <FormField label="Select Sender ID">
            <div className="flex flex-col md:flex-row gap-2">
              <Select className="flex-grow">
                <option>Select the name of your Business, Organization</option>
              </Select>
              <Link href="/dashboard/sms/sender-ids">
                <Button type="button" className="w-full md:w-auto">Create a sender ID</Button>
              </Link>
            </div>
          </FormField>

          <FormField label="Enter Recipients Phone Number (Optional)" helperText="Separate each number with a comma, e.g., 2348012345678,2348022223333.">
             <Textarea placeholder="Enter Recipient's Number here" />
          </FormField>
          
          <div className="flex flex-col md:flex-row gap-2 -mt-4">
              <Select className="flex-grow">
                <option>Choose from groups</option>
              </Select>
              <Link href="/dashboard/sms/groups">
                <Button type="button" className="w-full md:w-auto">Create a recipient group</Button>
              </Link>
          </div>

          <FormField label="Compose Message">
            <div className="flex flex-col md:flex-row gap-2">
                <Textarea className="flex-grow" placeholder="Type message here" />
                <Button type="button">Choose from templates</Button>
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Schedule Details">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Date">
                    <Input type="date" defaultValue="2025-04-10" />
                </FormField>
                <FormField label="Time">
                    <Input type="time" placeholder="Enter a time for this recipient group" />
                </FormField>
           </div>
        </FormSection>

        <div className="flex flex-wrap gap-4 pt-4">
            <Button type="submit">Send Now</Button>
            <Button type="button" variant="secondary">Save as Draft</Button>
            <Button type="button" className="!bg-cyan-500 hover:!bg-cyan-600">Schedule for Later</Button>
        </div>
      </div>
    </>
  );
};

export default SendBulkSmsPage;