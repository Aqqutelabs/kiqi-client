'use client';
import React, { useState } from 'react';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import { Card } from '@/components/atoms/Card';
// import { Button } from '@/components/atoms/Button';
import {
  Bold, Italic, Underline, Strikethrough, Pilcrow, List,
  Share, Download, RotateCcw,
  Paperclip, ArrowRight, Wand2, X
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';

const initialEmail = `Dear Flora,<br/><br/>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl arcu, elementum eget facilisis non, elementum et est. Cras ullamcorper lacus vel nisl mattis, sit amet lobortis est convallis. Sed rhoncus congue interdum.<br/><br/>
...<br/><br/>
Best regards,<br/>
Rage Jean Paige.`;

const chatHistory = [
    { from: 'user', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', avatar: '/user-avatar.png', time: "15:42"},
    { from: 'ai', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', avatar: '/kiqi-logo-icon.png', time: "15:42" },
    { from: 'user', text: 'Cras ullamcorper lacus vel nisl mattis, sit amet lobortis est convallis.', avatar: '/user-avatar.png', time: "15:45" },
];

const AiGeneratePage = () => {
    return (
        <DashboardLayout>
            <main className="h-full flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">AI Generated Email</h2>
                    <Button variant="tertiary" className="!bg-white border"><X size={20}/> Close</Button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-2 h-full overflow-hidden">
                    {/* Left Column: Rich Text Editor */}
                    <div className="col-span-1 xl:col-span-1 p-6 bg-white overflow-y-auto">
                        <Card className="h-full flex flex-col">
                            {/* Toolbar */}
                            <div className="flex-shrink-0 flex flex-wrap gap-2 items-center p-3 border-b">
                                <Button size="sm" variant="tertiary"><Bold size={16}/></Button>
                                <Button size="sm" variant="tertiary"><Italic size={16}/></Button>
                                <Button size="sm" variant="tertiary"><Underline size={16}/></Button>
                                <div className="border-l h-5 mx-2"/>
                                <Button size="sm" variant="tertiary"><Share size={16}/> Share</Button>
                                <Button size="sm" variant="tertiary"><Download size={16}/> Export</Button>
                                <Button size="sm" variant="tertiary"><RotateCcw size={16}/> Regenerate</Button>
                            </div>

                            {/* Editor Area (Placeholder) */}
                            <div
                                className="flex-grow p-4 text-gray-700 leading-relaxed focus:outline-none"
                                contentEditable
                                dangerouslySetInnerHTML={{ __html: initialEmail }}
                            />
                            
                            <div className="flex-shrink-0 p-4 border-t">
                                <Button>Send Email</Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Chat Interface */}
                    <div className="col-span-2 md:col-span-2 xl:col-span-1 bg-gray-50 flex flex-col h-full border-l">
                         <div className="p-4 border-b flex items-center gap-3">
                             <Wand2 className="text-purple-600"/>
                             <h3 className="font-semibold">KIQI Ai</h3>
                         </div>
                         <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <Image src={msg.avatar} alt="avatar" width={32} height={32} className="rounded-full w-8 h-8"/>
                                    <div className={`p-3 rounded-lg max-w-sm ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-gray-400'} text-right`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <div className="p-4 border-t bg-white">
                             <div className="relative">
                                <textarea 
                                    rows={1}
                                    placeholder="Describe the changes you want to make"
                                    className="w-full p-3 pr-24 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3366FF] resize-none"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <Button variant="tertiary" className="h-9 w-9 p-0 !bg-gray-100"><Paperclip size={18}/></Button>
                                    <Button className="h-9 w-9 p-0"><ArrowRight size={20}/></Button>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default AiGeneratePage;