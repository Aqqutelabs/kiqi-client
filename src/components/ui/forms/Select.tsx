import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, value, defaultValue, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(!!defaultValue || !!value);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
          className={twMerge(
            clsx(
              "flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3366FF] appearance-none bg-white",
              "focus:outline-none focus:border-[#3366FF]",
              "hover:border-[#3366FF]/60 transition-all duration-200 ease-in-out",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              // Apply gray color when placeholder is showing
              !hasValue && placeholder && "text-gray-400",
              className
            )
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
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