import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-[#FF5314] text-white hover:bg-[#E64A12]',
        secondary: 'bg-orange-400 text-white hover:bg-[#FF7A45]/90',
        tertiary: 'bg-[#FFE8E0] text-[#FF5314] hover:bg-[#FFD4C4]',
        destructive: 'bg-red-500 text-white hover:bg-red-500/90',
        link: 'underline-offset-4 hover:underline text-[#FF5314]',
        outline: 'border border-[#FF5314] bg-white hover:bg-orange-50 text-[#FF5314]',
        black: 'bg-black text-white hover:bg-black/70'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(clsx(buttonVariants({ variant, size, className })))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };