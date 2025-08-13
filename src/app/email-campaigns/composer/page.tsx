'use client';
import React from 'react';

import {
  Bold, Italic, Underline, Strikethrough, Pilcrow, List, Link as LinkIcon, Wand2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';

const initialEmail = `Dear Flora,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl arcu, elementum eget facilisis non, elementum et est. Cras ullamcorper lacus vel nisl mattis, sit amet lobortis est convallis. Sed rhoncus congue interdum.<br/><br/>Sed tempus eget felis vel accumsan. Nulla nec vestibulum dolor. Fusce lobortis felis quis mauris vestibulum, eu sodales arcu interdum.<br/><br/>Proin nec ultricies est. In massa erat, cursus et ultrices vel, condimentum et est. Nam in massa nec nulla vestibulum accumsan. Nullam nec vestibulum dolor.<br/><br/>Best regards,<br/>Rage Jean Paige.`;

// A simple toolbar button component for the editor
const ToolbarButton = ({ children }: { children: React.ReactNode }) => (
    <button type="button" className="p-2 rounded hover:bg-gray-100 text-gray-600">
        {children}
    </button>
);

const CampaignComposerPage = () => {
    return (
        <DashboardLayout>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <PageHeader title="Create a campaign" backLink="/dashboard/email-campaigns" />

                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Editor Card */}
                    <Card>
                        <h3 className="text-lg font-semibold p-4 border-b">Write Email</h3>
                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 border-b">
                            <ToolbarButton><Bold size={16}/></ToolbarButton>
                            <ToolbarButton><Italic size={16}/></ToolbarButton>
                            <ToolbarButton><Underline size={16}/></ToolbarButton>
                            <ToolbarButton><Strikethrough size={16}/></ToolbarButton>
                            <ToolbarButton><Pilcrow size={16}/></ToolbarButton>
                            <ToolbarButton><List size={16}/></ToolbarButton>
                            <ToolbarButton><LinkIcon size={16}/></ToolbarButton>
                        </div>
                        {/* Editor Area (Placeholder for a real library like TipTap) */}
                        <div
                            className="p-4 text-gray-700 leading-relaxed focus:outline-none min-h-[300px]"
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: initialEmail }}
                        />
                    </Card>

                    {/* AI Prompt Bar */}
                     <div className="relative">
                        <Input 
                            placeholder="Type here"
                            className="h-14 p-4 pr-32"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="tertiary" size="sm" className="!bg-white border"><Wand2 size={16} className="mr-1"/> Use Ai</Button>
                            <Button className="h-9 w-9 p-0"><ArrowRight size={20}/></Button>
                        </div>
                     </div>
                     
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button type="submit">Send Now</Button>
                        <Button type="button" variant="secondary">Save as Draft</Button>
                        <Button type="button" className="!bg-cyan-500 hover:!bg-cyan-600 !text-white">Schedule for Later</Button>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};
export default CampaignComposerPage;