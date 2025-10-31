import React, { ChangeEvent, useRef } from 'react';

interface SimpleFileInputProps {
    label: string;
    id: string;
    accept?: string;
    multiple?: boolean;
    onChange?: (files: FileList | null) => void;
    className?: string;
}

const SimpleFileInput: React.FC<SimpleFileInputProps> = ({
    label,
    id,
    accept,
    multiple = false,
    onChange,
    className = '',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.files);
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                ref={inputRef}
                type="file"
                id={id}
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
        </div>
    );
};

export default SimpleFileInput;