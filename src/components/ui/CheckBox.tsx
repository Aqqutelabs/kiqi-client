type CheckboxProps = {
  label?: string;
  isChecked?: boolean;
  name: string;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({ label, isChecked, name, onChange }: CheckboxProps) {
  const id = `checkbox-${name}`;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 border border-gray-300 accent-[var(--primary)]"
      />
      {label && (
        <label htmlFor={id} className="text-sm md:text-sm cursor-pointer whitespace-nowrap font-medium text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
}
