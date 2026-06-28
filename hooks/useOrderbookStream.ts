"use client";

import { useEffect, useRef, useState } from "react";
import {
  ConnectionStatus,
  OrderbookData,
  OrderbookStreamResult,
  RawOrderbookLevel,
  Side,
} from "@/common-types/orderbook";
import { buildStreamUrl } from "@/services/marketDataService";
import { parseRawOrderbookLevels, sortRawOrderbookLevels } from "@/utils/utils";

const THROTTLE_INTERVAL_MS = 2000;
const EMPTY_ORDERBOOK: OrderbookData = {
  lastUpdateId: 0,
  bids: [],
  asks: [],
};

function getReconnectDelay(retry: number): number {
  return Math.min(1000 * 2 ** retry, 10000);
}

export function useOrderbookStream(
  ticker: string,
  levels: number,
): OrderbookStreamResult {
  // Store latest WebSocket message in a ref to avoid triggering a render on every message.
  // The flush interval is the only place that updates state, throttling renders to every 2s.

  const latestRef = useRef<OrderbookData>(EMPTY_ORDERBOOK);
  const [orderbookData, setOrderbookData] =
    useState<OrderbookData>(EMPTY_ORDERBOOK);
  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Connecting,
  );

  useEffect(() => {
    let webSocket: WebSocket;
    let retry = 0;
    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      setStatus(ConnectionStatus.Connecting);
      setOrderbookData(EMPTY_ORDERBOOK);
      latestRef.current = EMPTY_ORDERBOOK;
      webSocket = new WebSocket(buildStreamUrl(ticker, levels));

      webSocket.onopen = () => {
        retry = 0;
        setStatus(ConnectionStatus.Live);
      };

      webSocket.onmessage = (messageEvent) => {
        const raw = JSON.parse(messageEvent.data);
        const toLevel = ([price, quantity]: string[]): RawOrderbookLevel => ({
          price,
          quantity,
        });
        latestRef.current = {
          lastUpdateId: raw.lastUpdateId,
          bids: parseRawOrderbookLevels(
            sortRawOrderbookLevels(raw.bids.map(toLevel), Side.Bid),
            levels,
          ),
          asks: parseRawOrderbookLevels(
            sortRawOrderbookLevels(raw.asks.map(toLevel), Side.Ask),
            levels,
          ),
        };
      };

      webSocket.onerror = () => {
        setStatus(ConnectionStatus.Error);
        setOrderbookData(EMPTY_ORDERBOOK);
        latestRef.current = EMPTY_ORDERBOOK;
        webSocket.close();
      };

      webSocket.onclose = () => {
        if (closed) {
          return;
        }

        setStatus((prev) =>
          prev === ConnectionStatus.Error
            ? prev
            : ConnectionStatus.Disconnected,
        );
        const delay = getReconnectDelay(retry);
        retry += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    const flush = setInterval(() => {
      if (latestRef.current) {
        setOrderbookData(latestRef.current);
      }
    }, THROTTLE_INTERVAL_MS);

    return () => {
      closed = true;
      setStatus(ConnectionStatus.Disconnected);
      clearTimeout(reconnectTimer);
      clearInterval(flush);
      webSocket?.close();
    };
  }, [ticker, levels]);

  return { orderbookData, status };
}
