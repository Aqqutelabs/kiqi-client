import * as React from 'react';
import { InputProps, Input } from './Input';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Create a simple Label atom if you don't have one
// /components/atoms/Label.tsx
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
 <label className={twMerge(clsx('text-sm font-normal text-[#1B223C]', className))} {...props} />
);

interface FormFieldProps extends InputProps {
  label?: string;
  id: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-4">
        <Label htmlFor={id} className='mb-4'>{label}</Label>
        <Input id={id} ref={ref} {...props} />
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };