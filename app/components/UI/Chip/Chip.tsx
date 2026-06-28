interface ChipProps {
  children: React.ReactNode;
  textColorClass: string;
  borderColorClass?: string;
  backgroundColorClass?: string;
  role?: string;
}

export const Chip = ({
  children,
  textColorClass,
  role,
  borderColorClass = "",
  backgroundColorClass = "",
}: ChipProps) => {
  return (
    <span
      role={role}
      className={`px-2 py-0.5 rounded-full border ${textColorClass} ${borderColorClass} ${backgroundColorClass}`}
    >
      {children}
    </span>
  );
};
