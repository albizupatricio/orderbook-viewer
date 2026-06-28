export interface RawOrderbookLevel {
  price: string;
  quantity: string;
}

export interface OrderbookLevel {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderbookData {
  lastUpdateId: number;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
}

export interface MarketSpread {
  absolute: number;
  percentage: number;
}

export interface OrderbookStreamResult {
  orderbookData: OrderbookData;
  status: ConnectionStatus;
}

export interface TickerInfo {
  id: string;
  displayName: string;
  baseAsset: string;
  quoteAsset: string;
  pricePrecision: number;
  quantityPrecision: number;
}

export enum ConnectionStatus {
  Connecting = "connecting",
  Live = "live",
  Error = "error",
  Disconnected = "disconnected",
}

export enum Side {
  Bid = "bid",
  Ask = "ask",
}

export enum PriceDirection {
  Up = "up",
  Down = "down",
}
