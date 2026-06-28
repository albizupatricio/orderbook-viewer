interface OrderbookSideHeaderProps {
  isBid: boolean;
  baseAsset: string;
  quoteAsset: string;
  priceColorClass: string;
}

export const OrderbookSideHeader = ({
  isBid,
  baseAsset,
  quoteAsset,
  priceColorClass,
}: OrderbookSideHeaderProps) => {
  return (
    <>
      <div
        className={`flex items-baseline gap-2 px-4 py-2 ${!isBid ? "flex-row-reverse" : ""}`}
      >
        <span className={`text-lg font-semibold ${priceColorClass}`}>
          {isBid ? "Bids" : "Asks"}
        </span>
        <span className="ov-mono-xs text-ov-subtitle">
          {isBid ? "BUY ORDERS" : "SELL ORDERS"}
        </span>
      </div>
      <div role="rowgroup">
        <div
          role="row"
          className={`flex items-center justify-between px-4 py-1 ov-border-b ${!isBid ? "flex-row-reverse" : ""}`}
        >
          <span role="columnheader" className="ov-mono-xs text-ov-subtitle">
            PRICE ({quoteAsset})
          </span>
          <span role="columnheader" className="ov-mono-xs text-ov-subtitle">
            QUANTITY ({baseAsset})
          </span>
        </div>
      </div>
    </>
  );
};
