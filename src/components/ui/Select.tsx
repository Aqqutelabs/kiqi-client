import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          {...props}
          className={twMerge(
            clsx(
              "flex h-11 w-full rounded-md border border-gray-100 bg-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:border-[#3366FF] appearance-none",
              "focus:outline-none  focus:border-[#3366FF]",
              "hover:border-[#3366FF]/60 transition-all duration-200 ease-in-out",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              className
            )
          )}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
