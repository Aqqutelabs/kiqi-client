import React from 'react';
import { Card } from '@/components/atoms/Card';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
};

export default FormSection;