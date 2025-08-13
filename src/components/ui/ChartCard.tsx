import React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { Card } from './Card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;

  className?: string;
}


export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  headerContent,
  className,
}) => {
  return (
    <Card className={twMerge(clsx('flex flex-col', className))}>
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          {headerContent}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#3366FF]"
            aria-label="More options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </Card>
  );
};