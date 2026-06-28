import { Toggle } from "@/app/components/UI/Toggle/Toggle";

interface OrderbookFooterProps {
  selectedLevels: number;
  levelsOptions: number[];
  onLevelsChange: (levels: number) => void;
}

const VOLUME_LEGEND = [
  { label: "BID VOLUME", colorClass: "bg-ov-bid/40" },
  { label: "ASK VOLUME", colorClass: "bg-ov-ask/40" },
];

export const OrderbookFooter = ({
  selectedLevels,
  levelsOptions,
  onLevelsChange,
}: OrderbookFooterProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 px-4 py-2 ov-border-t">
      <div className="flex items-center gap-4">
        {VOLUME_LEGEND.map(({ label, colorClass }) => (
          <span
            key={label}
            className="flex items-center gap-2 ov-mono-xs text-ov-subtitle"
          >
            <span
              aria-hidden="true"
              className={`w-5 h-3 rounded-sm ${colorClass} shrink-0`}
            />
            {label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span id="levels-label" className="ov-mono-xs text-ov-subtitle">
          LEVELS
        </span>
        <Toggle
          options={levelsOptions.map(String)}
          value={selectedLevels.toString()}
          onChange={(levelOption) => onLevelsChange(+levelOption)}
          ariaLabelledby="levels-label"
        />
      </div>
    </div>
  );
};
