"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ErrorToast } from "@/app/components/UI/ErrorToast/ErrorToast";
import { PriceDirection, Side, TickerInfo } from "@/common-types/orderbook";
import { useOrderbookStream } from "@/hooks/useOrderbookStream";
import { calculateMarketSpread, calculateMidPrice } from "@/utils/utils";
import { MarketSummary } from "./MarketSummary/MarketSummary";
import { OrderbookFooter } from "./OrderbookFooter/OrderbookFooter";
import { OrderbookHeader } from "./OrderbookHeader/OrderbookHeader";
import { OrderbookSide } from "./OrderbookSide/OrderbookSide";

interface OrderbookViewerProps {
  tickersInfo: TickerInfo[];
  hasError?: boolean;
  isLoading?: boolean;
}

const DEFAULT_LEVELS = 10;
const EMPTY_PRICE = NaN;

export const OrderbookViewer = ({
  tickersInfo,
  hasError,
  isLoading,
}: OrderbookViewerProps) => {
  const [levels, setLevels] = useState<number>(DEFAULT_LEVELS);
  const [tickerInfo, setTickerInfo] = useState<TickerInfo>(tickersInfo[0]);
  const lastMidPrice = useRef<number>(EMPTY_PRICE);
  const [direction, setDirection] = useState<PriceDirection>();
  const [showError, setShowError] = useState(hasError);

  const { orderbookData, status } = useOrderbookStream(tickerInfo.id, levels);

  const bestBid = orderbookData.bids[0]?.price ?? EMPTY_PRICE;
  const bestAsk = orderbookData.asks[0]?.price ?? EMPTY_PRICE;

  const maxBidQuantity = useMemo(
    () =>
      orderbookData.bids.reduce((max, bid) => Math.max(max, bid.quantity), 0),
    [orderbookData.bids],
  );

  const maxAskQuantity = useMemo(
    () =>
      orderbookData.asks.reduce((max, ask) => Math.max(max, ask.quantity), 0),
    [orderbookData.asks],
  );

  const midPrice = useMemo(
    () => calculateMidPrice(bestBid, bestAsk),
    [bestBid, bestAsk],
  );

  const spread = useMemo(
    () => calculateMarketSpread(bestBid, bestAsk),
    [bestBid, bestAsk],
  );

  useEffect(() => {
    if (midPrice > lastMidPrice.current) {
      setDirection(PriceDirection.Up);
    } else if (midPrice < lastMidPrice.current) {
      setDirection(PriceDirection.Down);
    }
    lastMidPrice.current = midPrice;
  }, [midPrice]);

  return (
    <>
      {showError && (
        <ErrorToast
          message="Failed to load tickers — showing default pairs"
          onClose={() => setShowError(false)}
        />
      )}
      <div className="max-w-3xl mx-auto rounded-xl ov-border bg-ov-surface">
        <OrderbookHeader
          tickersInfo={tickersInfo}
          selectedTicker={tickerInfo}
          status={status}
          onTickerInfoChange={setTickerInfo}
          isLoading={isLoading}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-ov-border min-h-52">
          <OrderbookSide
            levels={orderbookData.bids}
            side={Side.Bid}
            maxQuantity={maxBidQuantity}
            rows={levels}
            status={status}
            tickerInfo={tickerInfo}
          />
          <OrderbookSide
            levels={orderbookData.asks}
            side={Side.Ask}
            maxQuantity={maxAskQuantity}
            rows={levels}
            status={status}
            tickerInfo={tickerInfo}
          />
        </div>
        <OrderbookFooter
          selectedLevels={levels}
          levelsOptions={[10, 20]}
          onLevelsChange={setLevels}
        />
        <MarketSummary
          midPrice={midPrice}
          spread={spread}
          pricePrecision={tickerInfo.pricePrecision}
          direction={direction}
        />
      </div>
    </>
  );
};
