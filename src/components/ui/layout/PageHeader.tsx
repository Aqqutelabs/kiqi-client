import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backLink?: string; // The URL to navigate back to
  subtitle?: string; // the sub text under the heading
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backLink, subtitle }) => {
  return (
    <div className="space-y-0.5 mb-4">
      <div className="flex items-center">
        {backLink && (
          <Link href={backLink} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft size={28} color='#1B223C' />
          </Link>
        )}
        <h2 className="text-2xl font-semibold text-[#1B223C]">{title}</h2>
      </div>
      <p className={`text-sm text-[#42526D] ${backLink && 'ml-3'}`}>{subtitle}</p>
    </div>
  );
};

export { PageHeader };