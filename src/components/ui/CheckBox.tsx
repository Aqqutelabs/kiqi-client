import React from 'react';

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, label, className }) => (
    <div className={className}>
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
        />
        {label && (
            <label htmlFor={id} style={{ marginLeft: 4 }}>
                {label}
            </label>
        )}
    </div>
);

export default Checkbox;