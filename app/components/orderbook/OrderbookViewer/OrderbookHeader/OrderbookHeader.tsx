import { ChartBarDecreasing, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Chip } from "@/app/components/UI/Chip/Chip";
import { Select } from "@/app/components/UI/Select/Select";
import { Option } from "@/app/components/UI/Select/types";
import { ConnectionStatus, TickerInfo } from "@/common-types/orderbook";

interface OrderbookHeaderProps {
  tickersInfo: TickerInfo[];
  status: ConnectionStatus;
  onTickerInfoChange: (tickerInfo: TickerInfo) => void;
  selectedTicker?: TickerInfo;
  isLoading?: boolean;
}

interface StatusStyle {
  border: string;
  text: string;
  background: string;
  dot: string;
}

const STATUS_CHIP_STYLES: Record<ConnectionStatus, StatusStyle> = {
  [ConnectionStatus.Live]: {
    border: "border-ov-live/40",
    text: "text-ov-live",
    background: "bg-ov-live/10",
    dot: "bg-ov-live",
  },
  [ConnectionStatus.Connecting]: {
    border: "border-ov-connecting/40",
    text: "text-ov-connecting",
    background: "bg-ov-connecting/10",
    dot: "bg-ov-connecting",
  },
  [ConnectionStatus.Error]: {
    border: "border-ov-error/40",
    text: "text-ov-error",
    background: "bg-ov-error/10",
    dot: "bg-ov-error",
  },
  [ConnectionStatus.Disconnected]: {
    border: "border-ov-disconnected/40",
    text: "text-ov-disconnected",
    background: "bg-ov-disconnected/10",
    dot: "bg-ov-disconnected",
  },
};

export const OrderbookHeader = ({
  tickersInfo,
  selectedTicker,
  status,
  onTickerInfoChange,
  isLoading,
}: OrderbookHeaderProps) => {
  const statusChipStyles = STATUS_CHIP_STYLES[status];

  const tickerOptions = useMemo(
    () =>
      tickersInfo.map((tickerInfo) => ({
        value: tickerInfo.id,
        label: tickerInfo.displayName,
      })),
    [tickersInfo],
  );

  const selectedOption = useMemo(
    () =>
      selectedTicker && {
        value: selectedTicker.id,
        label: selectedTicker.displayName,
      },
    [selectedTicker],
  );

  const handleTickerChange = (option: Option) => {
    const tickerInfo = tickersInfo.find((t) => t.id === option.value);
    if (tickerInfo) {
      onTickerInfoChange(tickerInfo);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 ov-border-b">
      <div className="flex items-center gap-3">
        <ChartBarDecreasing
          size={16}
          aria-hidden="true"
          className={statusChipStyles.text}
        />
        <h2 className="text-lg font-medium text-ov-default">
          Orderbook Viewer
        </h2>
        <span
          className={`inline-flex ${status === ConnectionStatus.Connecting && "animate-pulse-strong"}`}
        >
          <Chip
            borderColorClass={statusChipStyles.border}
            textColorClass={statusChipStyles.text}
            backgroundColorClass={statusChipStyles.background}
            role={"status"}
          >
            <span className="flex items-center gap-1.5 text-xs">
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusChipStyles.dot}`}
              />
              <span className="capitalize">{status}</span>
            </span>
          </Chip>
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isLoading && (
          <Loader2
            size={14}
            aria-label="Loading tickers"
            className="animate-spin text-ov-subtitle"
          />
        )}
        <Select
          options={tickerOptions}
          selectedOption={selectedOption}
          onChange={handleTickerChange}
          searchable
          maxVisible={5}
          optionLabel="ticker"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
