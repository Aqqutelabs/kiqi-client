'use client';
import React from 'react';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import Header from '@/components/organisms/Header';
// import { Button } from '@/components/atoms/Button';
// import { Card } from '@/components/atoms/Card';
import { Wand2, Plus, ArrowRight, Sparkles, Zap, Search, Link } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import Header from '@/components/ui/layout/Header';

const promptSuggestions = [
  "Create a 3-email welcome sequence for new subscribers.",
  "List my last 5 email campaigns",
  "Show me emails that had a bounce rate over 3%.",
  "Generate a holiday promotion email with a 20% discount.",
  "Write a product launch email with a catchy subject line",
];

const templates = [
    { title: "Connect your wallet", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Connect your wallet", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Connect your wallet", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

// Reusable Template Card Component
const TemplateCard = ({title, desc}: {title: string, desc: string}) => (
    <Card className="p-4 flex flex-col">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500 mt-1 flex-grow">{desc}</p>
        <div className="flex gap-2 mt-4">
            <Button size="sm" variant="tertiary" className="!text-xs">How to get started</Button>
            <Button size="sm" variant="tertiary" className="!text-xs">Web 3 Integration</Button>
        </div>
    </Card>
)

const KiQiAiPage = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Wand2 className="text-purple-600" size={28}/>
                    <h2 className="text-2xl font-semibold text-gray-800">KiQi Ai</h2>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700"><Zap size={16} className="mr-2"/>Upgrade</Button>
            </div>
            
            <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Supercharge your campaigns with <span className="text-purple-600">KiQi Ai</span>
                </h1>
                
                {/* AI Prompt Input */}
                <div className="mt-8">
                    <Card className="p-2 text-left">
                        <textarea 
                            rows={4}
                            className="w-full p-4 border-0 rounded-t-lg resize-none focus:ring-0 focus:outline-none placeholder:text-gray-400" 
                            placeholder="Ask anything here"
                        />
                        <div className="flex justify-between items-center p-2 border-t border-gray-100">
                            <Button variant="tertiary" size="sm" className="bg-white border"><Plus size={16} className="mr-1"/>Tools</Button>
                            <div className="flex items-center gap-2">
                                 <Button variant="tertiary" size="sm" className="bg-white border"><Sparkles size={16} className="mr-1"/>Smart compose</Button>
                                 <Button className="h-9 w-9 p-0"><ArrowRight size={20}/></Button>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* Prompt Suggestions */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {promptSuggestions.map((prompt, i) => (
                        <button key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors">
                            {prompt}
                        </button>
                    ))}
                </div>
                
                <Button className="mt-8"><Plus size={16} className="mr-2"/>Create Manually</Button>
            </div>
            
            {/* Templates Section */}
            <section className="mt-16">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Templates</h3>
                    <Link href="#" className="text-sm font-semibold text-[#3366FF] flex items-center gap-1">View All <ArrowRight size={14} /></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template, i) => (
                        <TemplateCard key={i} title={template.title} desc={template.desc} />
                    ))}
                </div>
            </section>
            
        </main>
      </div>
    </DashboardLayout>
  );
};

export default KiQiAiPage;