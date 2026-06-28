import { OrderbookLevel } from "@/common-types/orderbook";

interface OrderbookSideRowProps {
  maxQuantity: number;
  priceColorClass: string;
  barColorClass: string;
  isBid: boolean;
  pricePrecision: number;
  quantityPrecision: number;
  level?: OrderbookLevel;
}

export const OrderbookSideRow = ({
  maxQuantity,
  priceColorClass,
  barColorClass,
  isBid,
  level,
  pricePrecision,
  quantityPrecision,
}: OrderbookSideRowProps) => {
  return (
    <div role="row" className="relative h-6 flex items-center px-4">
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 ${isBid ? "right-0" : "left-0"} ${barColorClass}`}
        style={{
          width: level ? `${(level.quantity / maxQuantity) * 100}%` : "0%",
        }}
      />
      {isBid ? (
        <>
          <span
            role="cell"
            className={`relative ov-mono-xs ${priceColorClass}`}
          >
            {level?.price.toFixed(pricePrecision)}
          </span>
          <span
            role="cell"
            className="relative ov-mono-xs text-ov-quantity ml-auto"
          >
            {level?.quantity.toFixed(quantityPrecision)}
          </span>
        </>
      ) : (
        <>
          <span role="cell" className="relative ov-mono-xs text-ov-quantity">
            {level?.quantity.toFixed(quantityPrecision)}
          </span>
          <span
            role="cell"
            className={`relative ov-mono-xs ${priceColorClass} ml-auto`}
          >
            {level?.price.toFixed(pricePrecision)}
          </span>
        </>
      )}
    </div>
  );
};
