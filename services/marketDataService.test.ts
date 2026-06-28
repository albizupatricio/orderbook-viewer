import {
  buildStreamUrl,
  getTickersInfo,
  StreamInterval,
  TOP_TICKERS,
} from "./marketDataService";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const MOCK_SYMBOLS = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    filters: [
      { filterType: "PRICE_FILTER", tickSize: "0.01" },
      { filterType: "LOT_SIZE", stepSize: "0.00001" },
    ],
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    filters: [
      { filterType: "PRICE_FILTER", tickSize: "0.01" },
      { filterType: "LOT_SIZE", stepSize: "0.0001" },
    ],
  },
  {
    symbol: "XRPUSDT",
    baseAsset: "XRP",
    quoteAsset: "USDT",
    filters: [
      { filterType: "PRICE_FILTER", tickSize: "0.0001" },
      { filterType: "LOT_SIZE", stepSize: "0.1" },
    ],
  },
];

describe("buildStreamUrl", () => {
  it("builds correct URL with default params", () => {
    expect(buildStreamUrl("BTCUSDT")).toBe(
      "wss://stream.binance.com:9443/ws/btcusdt@depth10@1000ms",
    );
  });

  it("builds correct URL with custom levels and interval", () => {
    expect(buildStreamUrl("ETHUSDT", 20, StreamInterval.Fast)).toBe(
      "wss://stream.binance.com:9443/ws/ethusdt@depth20@100ms",
    );
  });
});

describe("getTickersInfo", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("returns tickers with correct shape", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ symbols: MOCK_SYMBOLS }),
    });

    const tickers = await getTickersInfo();
    expect(tickers[0]).toMatchObject({
      id: "BTCUSDT",
      displayName: "BTC/USDT",
      baseAsset: "BTC",
      quoteAsset: "USDT",
    });
  });

  it("places top tickers first", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ symbols: MOCK_SYMBOLS }),
    });

    const tickers = await getTickersInfo();
    const topIds = TOP_TICKERS.map((t) => t.id);
    const firstIds = tickers.slice(0, topIds.length).map((t) => t.id);
    expect(firstIds).toEqual(
      expect.arrayContaining(
        topIds.filter((id) => MOCK_SYMBOLS.some((s) => s.symbol === id)),
      ),
    );
  });

  it("calculates pricePrecision and quantityPrecision correctly", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ symbols: MOCK_SYMBOLS }),
    } as Response);

    const tickers = await getTickersInfo();
    const btc = tickers.find((t) => t.id === "BTCUSDT");
    expect(btc?.pricePrecision).toBe(2);
    expect(btc?.quantityPrecision).toBe(5);
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(getTickersInfo()).rejects.toThrow("Exchange Info failed: 500");
  });

  it("uses default precision when filter is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        symbols: [
          {
            symbol: "XYZUSDT",
            baseAsset: "XYZ",
            quoteAsset: "USDT",
            filters: [],
          },
        ],
      }),
    });

    const tickers = await getTickersInfo();
    expect(tickers[0].pricePrecision).toBe(2);
  });

  it("sorts non-top tickers alphabetically", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        symbols: [
          {
            symbol: "ZETAUSDT",
            baseAsset: "ZETA",
            quoteAsset: "USDT",
            filters: [],
          },
          {
            symbol: "AAVEUSDT",
            baseAsset: "AAVE",
            quoteAsset: "USDT",
            filters: [],
          },
        ],
      }),
    });

    const tickers = await getTickersInfo();
    expect(tickers[0].id).toBe("AAVEUSDT");
    expect(tickers[1].id).toBe("ZETAUSDT");
  });
});
