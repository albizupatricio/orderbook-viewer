import { ArrowUp, ArrowDown } from "lucide-react";
import { MarketSpread, PriceDirection } from "@/common-types/orderbook";

interface MarketSummaryProps {
  midPrice: number;
  spread: MarketSpread;
  pricePrecision: number;
  direction?: PriceDirection;
}

interface DirectionStyle {
  colorClass: string;
  arrow: React.ReactNode;
}

const DIRECTION_STYLES: Record<PriceDirection, DirectionStyle> = {
  [PriceDirection.Up]: {
    colorClass: "text-ov-bid",
    arrow: <ArrowUp size={14} aria-label="Price going up" />,
  },
  [PriceDirection.Down]: {
    colorClass: "text-ov-ask",
    arrow: <ArrowDown size={14} aria-label="Price going down" />,
  },
};

export const MarketSummary = ({
  midPrice,
  spread,
  pricePrecision,
  direction,
}: MarketSummaryProps) => {
  const { colorClass: midPriceColorClass, arrow: directionArrow } = direction
    ? DIRECTION_STYLES[direction]
    : { colorClass: "text-ov-default", arrow: null };

  const hasSpread = !isNaN(spread.absolute);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 ov-border-t">
      <div className="flex flex-col items-center py-3">
        <span id="mid-price-label" className="ov-subtitle">
          MID PRICE
        </span>
        <span
          aria-labelledby="mid-price-label"
          className={`flex items-center gap-2 ov-mono-lg transition-colors duration-300 ${midPriceColorClass}`}
        >
          {isNaN(midPrice) ? "—" : midPrice.toFixed(pricePrecision)}
          <span className="leading-none">{directionArrow}</span>
        </span>
      </div>
      <div className="flex flex-col items-center py-3 sm:ov-border-l ov-border-t sm:border-t-0">
        <span id="spread-label" className="ov-subtitle">
          SPREAD
        </span>
        <span
          aria-labelledby="spread-label"
          className="ov-mono-lg text-ov-spread"
        >
          {hasSpread ? (
            <>
              {spread.absolute.toFixed(pricePrecision)}
              <span className="ov-subtitle ml-1">
                ({spread.percentage.toFixed(6)}%)
              </span>
            </>
          ) : (
            "—"
          )}
        </span>
      </div>
    </div>
  );
};
