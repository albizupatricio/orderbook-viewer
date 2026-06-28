import { SearchableSelect } from "./SearchableSelect";
import { BaseSelectProps } from "./types";

interface SelectProps extends BaseSelectProps {
  searchable?: boolean;
}

export const Select = ({
  options,
  selectedOption,
  onChange,
  disabled = false,
  searchable = false,
  maxVisible = 50,
  optionLabel = "",
}: SelectProps) => {
  if (searchable) {
    return (
      <SearchableSelect
        {...{
          options,
          selectedOption,
          onChange,
          maxVisible,
          optionLabel,
          disabled,
        }}
      />
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find(
      (option) => option.value === event.target.value,
    );

    if (selected) {
      onChange(selected);
    }
  };

  return (
    <select
      value={selectedOption?.value}
      onChange={handleChange}
      disabled={disabled}
      aria-label={optionLabel ? `Select ${optionLabel}` : "Select"}
      className="rounded ov-border bg-ov-disconnected/20 pl-3 py-1.5 ov-mono-sm text-ov-default cursor-pointer focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
