import { TickerInfo } from "@/common-types/orderbook";

const BINANCE_WEB_SOCKET_BASE_URL = "wss://stream.binance.com:9443/ws";
const BINANCE_EXCHANGE_INFO_URL =
  "https://api.binance.com/api/v3/exchangeInfo?symbolStatus=TRADING&showPermissionSets=false&permissions=SPOT";

const EXCHANGE_INFO_REVALIDATE_SECONDS = 86400;
export const TOP_TICKERS: TickerInfo[] = [
  {
    id: "BTCUSDT",
    displayName: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    pricePrecision: 2,
    quantityPrecision: 5,
  },
  {
    id: "USDCUSDT",
    displayName: "USDC/USDT",
    baseAsset: "USDC",
    quoteAsset: "USDT",
    pricePrecision: 4,
    quantityPrecision: 2,
  },
  {
    id: "ETHUSDT",
    displayName: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    pricePrecision: 2,
    quantityPrecision: 4,
  },
  {
    id: "BTCUSDC",
    displayName: "BTC/USDC",
    baseAsset: "BTC",
    quoteAsset: "USDC",
    pricePrecision: 2,
    quantityPrecision: 5,
  },
  {
    id: "ETHUSDC",
    displayName: "ETH/USDC",
    baseAsset: "ETH",
    quoteAsset: "USDC",
    pricePrecision: 2,
    quantityPrecision: 4,
  },
];

const PRICE_FILTER = "PRICE_FILTER" as const;
const LOT_SIZE_FILTER = "LOT_SIZE" as const;
const DEFAULT_TICK_SIZE = "0.01";

interface PriceFilter {
  filterType: typeof PRICE_FILTER;
  tickSize: string;
}

interface LotSizeFilter {
  filterType: typeof LOT_SIZE_FILTER;
  stepSize: string;
}

interface TradingPairData {
  symbol: string;
  quoteAsset: string;
  baseAsset: string;
  filters: (PriceFilter | LotSizeFilter)[];
}

interface BinanceExchangeData {
  symbols: TradingPairData[];
}

export enum StreamInterval {
  Fast = 100,
  Slow = 1000,
}

export function buildStreamUrl(
  ticker: string,
  levels: number = 10,
  interval: StreamInterval = StreamInterval.Slow,
): string {
  return `${BINANCE_WEB_SOCKET_BASE_URL}/${ticker.toLowerCase()}@depth${levels}@${interval}ms`;
}

/*                                                                                                                                                                                    
  Mocked top tickers instead of calling GET /api/v3/ticker/24hr (out of scope).                                                                                                      
  Saves the user from filtering a large list and would reduce backend load                                                                                                           
  if server-side filtering were supported. 
  Trade-off: pinned pairs are unlikely but not impossible to change over time.                                                                                                       
*/

const topIdRank = new Map(TOP_TICKERS.map((topTicker, i) => [topTicker.id, i]));
const getPricePrecision = (tickSize: string): number =>
  Math.max(0, tickSize.indexOf("1") - tickSize.indexOf("."));

const compareByTopTickers = (a: TickerInfo, b: TickerInfo): number => {
  const aRank = topIdRank.get(a.id) ?? Infinity;
  const bRank = topIdRank.get(b.id) ?? Infinity;
  if (aRank !== bRank) return aRank - bRank;
  return a.id.localeCompare(b.id);
};

export async function getTickersInfo(): Promise<TickerInfo[]> {
  const res = await fetch(BINANCE_EXCHANGE_INFO_URL, {
    next: { revalidate: EXCHANGE_INFO_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Exchange Info failed: ${res.status}`);
  }

  const binanceExchangeData: BinanceExchangeData = await res.json();

  return binanceExchangeData.symbols
    .map((tradingPair) => ({
      id: tradingPair.symbol,
      displayName: `${tradingPair.baseAsset}/${tradingPair.quoteAsset}`,
      baseAsset: tradingPair.baseAsset,
      quoteAsset: tradingPair.quoteAsset,
      pricePrecision: getPricePrecision(
        tradingPair.filters.find(
          (tradingPairFilter) => tradingPairFilter.filterType === PRICE_FILTER,
        )?.tickSize ?? DEFAULT_TICK_SIZE,
      ),
      quantityPrecision: getPricePrecision(
        tradingPair.filters.find(
          (tradingPairFilter) =>
            tradingPairFilter.filterType === LOT_SIZE_FILTER,
        )?.stepSize ?? DEFAULT_TICK_SIZE,
      ),
    }))
    .sort(compareByTopTickers);
}
