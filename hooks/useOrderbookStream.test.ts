import { renderHook, act, waitFor } from "@testing-library/react";
import WS from "jest-websocket-mock";
import { ConnectionStatus } from "@/common-types/orderbook";
import { useOrderbookStream } from "./useOrderbookStream";

const MOCK_URL = "wss://stream.binance.com:9443/ws/btcusdt@depth10@1000ms";

const MOCK_MESSAGE = {
  lastUpdateId: 123,
  bids: [
    ["50000.00", "1.5"],
    ["49999.00", "2.0"],
  ],
  asks: [
    ["50001.00", "1.0"],
    ["50002.00", "3.0"],
  ],
};

describe("useOrderbookStream", () => {
  let server: WS;

  beforeEach(() => {
    server = new WS(MOCK_URL);
  });

  afterEach(() => {
    WS.clean();
    jest.useRealTimers();
  });

  it("starts with Connecting status", () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    expect(result.current.status).toBe(ConnectionStatus.Connecting);
  });

  it("sets status to Live when connection opens", async () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    expect(result.current.status).toBe(ConnectionStatus.Live);
  });

  it("starts with empty orderbook", () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    expect(result.current.orderbookData.bids).toEqual([]);
    expect(result.current.orderbookData.asks).toEqual([]);
  });

  it("sets status to Disconnected on close", async () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    act(() => server.close());
    expect(result.current.status).toBe(ConnectionStatus.Disconnected);
  });

  it("sets status to Error on error", async () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    act(() => server.error());
    expect(result.current.status).toBe(ConnectionStatus.Error);
  });

  it("processes messages and updates orderbook after flush", async () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    act(() => {
      server.send(JSON.stringify(MOCK_MESSAGE));
    });
    await waitFor(
      () => {
        expect(result.current.orderbookData.bids[0].price).toBe(50000);
      },
      { timeout: 3000 },
    );
    expect(result.current.orderbookData.asks[0].price).toBe(50001);
  });

  it("closes WebSocket on unmount", async () => {
    const { unmount } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    unmount();
  });

  it("reconnects after unexpected disconnect", async () => {
    const { result } = renderHook(() => useOrderbookStream("BTCUSDT", 10));
    await server.connected;
    act(() => server.close());
    expect(result.current.status).toBe(ConnectionStatus.Disconnected);
    new WS(MOCK_URL);
    await waitFor(
      () => {
        expect(result.current.status).toBe(ConnectionStatus.Live);
      },
      { timeout: 3000 },
    );
  });
});
