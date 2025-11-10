import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'intermediate';
  info?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, info }) => {
  const isIncrease = changeType === 'increase';
  const isIntermediate = changeType === 'intermediate';
  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-end space-x-2 mt-1">
          <p className="text-2xl font-bold">{value}</p>
         {change && changeType && <div className={`flex items-center text-xs font-semibold ${isIncrease ? 'text-green-500' : isIntermediate ? 'text-gray-500' : 'text-red-500'}`}>
            <ArrowUp size={14} className={`${!isIncrease && 'rotate-180'}`} />
            <span>{change}</span>
          </div>}
        </div>
          {info && <p title={info} className='text-xs text-gray-500 mt-2 truncate'>{info}</p>}
      </div>
    </Card>
  );
};

export { StatCard };