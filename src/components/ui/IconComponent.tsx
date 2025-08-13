import React from 'react';
import { LucideProps, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface IconProps extends LucideProps {
  /** The icon component itself from lucide-react, e.g., Wallet, Settings */
  icon: LucideIcon;
}

/**
 * A reusable, styled wrapper for lucide-react icons.
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  className,
  ...props
}) => {
  return (
    <IconComponent
      className={twMerge(clsx('h-5 w-5', className))} // Default size, can be overridden
      strokeWidth={1.5} // Default stroke-width for a sleeker look
      {...props}
    />
  );
};