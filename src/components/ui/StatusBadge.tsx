import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define the variants for the badge
const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full',
  {
    variants: {
      variant: {
        active: 'bg-green-100 text-green-800',
        scheduled: 'bg-orange-100 text-orange-800',
        completed: 'bg-blue-100 text-blue-800',
        draft: 'bg-gray-100 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'draft',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const StatusBadge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return (
    <div
      className={twMerge(clsx(badgeVariants({ variant, className })))}
      {...props}
    />
  );
};

export { StatusBadge };