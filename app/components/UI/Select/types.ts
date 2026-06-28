export interface Option {
  value: string;
  label: string;
}

export interface BaseSelectProps {
  options: Option[];
  onChange: (selectedOption: Option) => void;
  maxVisible?: number;
  optionLabel?: string;
  disabled?: boolean;
  selectedOption?: Option;
}
