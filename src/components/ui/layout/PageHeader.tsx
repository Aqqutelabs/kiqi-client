import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backLink?: string; // The URL to navigate back to
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backLink }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {backLink && (
        <Link href={backLink} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </Link>
      )}
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export { PageHeader };