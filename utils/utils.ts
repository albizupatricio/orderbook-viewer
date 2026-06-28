import {
  MarketSpread,
  OrderbookLevel,
  RawOrderbookLevel,
  Side,
} from "@/common-types/orderbook";

export function parseRawOrderbookLevels(
  orderbookLevels: RawOrderbookLevel[],
  limit: number,
): OrderbookLevel[] {
  let accumulatedQuantity = 0;

  return orderbookLevels.slice(0, limit).map(({ price, quantity }) => {
    const parsedQuantity = +quantity;
    accumulatedQuantity += parsedQuantity;
    return {
      price: +price,
      quantity: parsedQuantity,
      total: accumulatedQuantity,
    };
  });
}

export function sortRawOrderbookLevels(
  orderbookLevels: RawOrderbookLevel[],
  side: Side,
): RawOrderbookLevel[] {
  return [...orderbookLevels].sort((a, b) =>
    side === Side.Ask ? +a.price - +b.price : +b.price - +a.price,
  );
}

export function calculateMidPrice(bestBid: number, bestAsk: number): number {
  if (isNaN(bestBid) || isNaN(bestAsk)) {
    return NaN;
  }

  return (bestBid + bestAsk) / 2;
}

export function calculateMarketSpread(
  bestBid: number,
  bestAsk: number,
): MarketSpread {
  if (isNaN(bestBid) || isNaN(bestAsk)) {
    return { absolute: NaN, percentage: NaN };
  }

  const absolute = bestAsk - bestBid;
  const percentage = bestBid > 0 ? (absolute / bestBid) * 100 : 0;
  return { absolute, percentage };
}
