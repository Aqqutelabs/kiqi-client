import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx('bg-white rounded-xl shadow-md p-6 sm:p-8', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };