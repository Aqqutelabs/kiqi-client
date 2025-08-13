import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-end space-x-2 mt-1">
          <p className="text-2xl font-bold">{value}</p>
          <div className={`flex items-center text-xs font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
            <ArrowUp size={14} className={`${!isIncrease && 'rotate-180'}`} />
            <span>{change}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export { StatCard };