import * as React from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, placeholder, children, value, defaultValue, ...props },
    ref
  ) => {
    const hasValue =
      (value !== undefined && value !== "") ||
      (defaultValue !== undefined && defaultValue !== "");

    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          className={twMerge(
            clsx(
              "w-full border border-gray-300 rounded-md px-3 py-[10px] appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm",
              !hasValue && "text-gray-400",
              className
            )
          )}
          {...props}>
          {/* Placeholder (hidden from options but shown when no value) */}
          {placeholder && (
            <option value="" disabled hidden className="text-sm cursor-not-allowed">
              {placeholder}
            </option>
          )}
          {children && children}
        </select>

        {/* Icon */}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
