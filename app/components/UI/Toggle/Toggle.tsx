interface ToggleProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabelledby?: string;
}

export const Toggle = ({
  options,
  value,
  onChange,
  ariaLabelledby,
}: ToggleProps) => {
  return (
    <div
      role="group"
      aria-labelledby={ariaLabelledby}
      className="flex items-center ov-border rounded-lg p-0.5 gap-0.5"
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={option === value}
          className={`px-3 py-1 ov-mono-xs rounded-md cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ov-default ${option === value ? "bg-ov-control text-ov-default" : "text-ov-subtitle"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
