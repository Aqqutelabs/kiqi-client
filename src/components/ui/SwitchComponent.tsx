type ToggleProps = {
  label?: string;
  name: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleSwitch({ label, name, isChecked, onChange }: ToggleProps) {
  const id = `toggle-${name}`;
  
  return (
    <div className="flex items-center gap-3">
      {label && (
        <label
          htmlFor={id}
          className="text-xs md:text-sm cursor-pointer whitespace-nowrap font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`
            relative inline-block w-12 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
            ${isChecked ? 'bg-[#233E97]' : 'bg-[#E5E5E5]'}
          `}
        >
          <span
            className={`
              absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out
              ${isChecked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </label>
      </div>
    </div>
  );
}