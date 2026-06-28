import { ChartBarDecreasing } from "lucide-react";
import { memo } from "react";
import {
  ConnectionStatus,
  OrderbookLevel,
  Side,
  TickerInfo,
} from "@/common-types/orderbook";
import { OrderbookSideHeader } from "./OrderbookSideHeader/OrderbookSideHeader";
import { OrderbookSideRow } from "./OrderbookSideRow/OrderbookSideRow";

interface OrderbookSideProps {
  levels: OrderbookLevel[];
  side: Side;
  maxQuantity: number;
  rows: number;
  tickerInfo: TickerInfo;
  status: ConnectionStatus;
}

const STATUS_EMPTY_MESSAGE: Record<ConnectionStatus, string> = {
  [ConnectionStatus.Connecting]: "No data available yet — Connecting",
  [ConnectionStatus.Error]: "No data available — Connection error",
  [ConnectionStatus.Disconnected]: "No data available — Disconnected",
  [ConnectionStatus.Live]: "No data available — Stream initializing",
};

export const OrderbookSide = memo(function OrderbookSide({
  levels,
  side,
  maxQuantity,
  rows,
  status,
  tickerInfo,
}: OrderbookSideProps) {
  const isBid = side === Side.Bid;
  const priceColorClass = isBid ? "text-ov-bid" : "text-ov-ask";
  const barColorClass = isBid ? "bg-ov-bid/15" : "bg-ov-ask/15";

  return (
    <div role="table" aria-label={isBid ? "Bids" : "Asks"}>
      <OrderbookSideHeader
        isBid={isBid}
        baseAsset={tickerInfo.baseAsset}
        quoteAsset={tickerInfo.quoteAsset}
        priceColorClass={priceColorClass}
      />
      {levels.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center justify-center gap-2 min-h-56 text-ov-subtitle"
        >
          <ChartBarDecreasing aria-hidden="true" size={20} />
          <span className="ov-mono-xs">{STATUS_EMPTY_MESSAGE[status]}</span>
        </div>
      ) : (
        Array.from({ length: rows }, (_, i) => (
          <OrderbookSideRow
            key={i}
            level={levels[i]}
            maxQuantity={maxQuantity}
            priceColorClass={priceColorClass}
            barColorClass={barColorClass}
            isBid={isBid}
            pricePrecision={tickerInfo.pricePrecision}
            quantityPrecision={tickerInfo.quantityPrecision}
          />
        ))
      )}
    </div>
  );
});
