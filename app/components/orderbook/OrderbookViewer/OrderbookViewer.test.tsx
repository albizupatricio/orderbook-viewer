import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectionStatus } from "@/common-types/orderbook";
import { useOrderbookStream } from "@/hooks/useOrderbookStream";
import { OrderbookViewer } from "./OrderbookViewer";

jest.mock("framer-motion");
jest.mock("@/hooks/useOrderbookStream");

const mockUseOrderbookStream = useOrderbookStream as jest.MockedFunction<
  typeof useOrderbookStream
>;

const tickersInfo = [
  {
    id: "BTCUSDT",
    displayName: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    pricePrecision: 2,
    quantityPrecision: 5,
  },
  {
    id: "ETHUSDT",
    displayName: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    pricePrecision: 2,
    quantityPrecision: 4,
  },
];

const emptyOrderbook = { lastUpdateId: 0, bids: [], asks: [] };

const mockOrderbookData = {
  lastUpdateId: 1,
  bids: [
    { price: 50000, quantity: 1.5, total: 1.5 },
    { price: 49999, quantity: 2.0, total: 3.5 },
  ],
  asks: [
    { price: 50001, quantity: 1.0, total: 1.0 },
    { price: 50002, quantity: 0.5, total: 1.5 },
  ],
};

describe("OrderbookViewer", () => {
  beforeEach(() => {
    mockUseOrderbookStream.mockReturnValue({
      orderbookData: emptyOrderbook,
      status: ConnectionStatus.Live,
    });
  });

  it("renders all main sections and calls hook with defaults", () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByText("Orderbook Viewer")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Bids" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Asks" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(mockUseOrderbookStream).toHaveBeenCalledWith("BTCUSDT", 10);
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} isLoading />);
    expect(screen.getByLabelText("Loading tickers")).toBeInTheDocument();
  });

  it("shows error toast when hasError is true and dismisses on close", async () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} hasError />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Failed to load tickers/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders prices, mid price and spread from orderbook data", () => {
    mockUseOrderbookStream.mockReturnValue({
      orderbookData: mockOrderbookData,
      status: ConnectionStatus.Live,
    });
    render(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByText("50000.00")).toBeInTheDocument();
    expect(screen.getByText("50001.00")).toBeInTheDocument();
    // mid price = (50000 + 50001) / 2 = 50000.5
    expect(screen.getByText("50000.50")).toBeInTheDocument();
    // spread = 50001 - 50000 = 1.00
    expect(screen.getByText("1.00")).toBeInTheDocument();
  });

  it("calls useOrderbookStream with new levels when changed", async () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} />);
    await userEvent.click(screen.getByRole("button", { name: "20" }));
    expect(mockUseOrderbookStream).toHaveBeenCalledWith("BTCUSDT", 20);
  });

  it("calls useOrderbookStream with new ticker when changed", async () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Select ticker" }),
    );
    await userEvent.click(screen.getByText("ETH/USDT"));
    expect(mockUseOrderbookStream).toHaveBeenCalledWith("ETHUSDT", 10);
  });

  it("shows up arrow when mid price increases", () => {
    mockUseOrderbookStream.mockReturnValue({
      orderbookData: {
        lastUpdateId: 1,
        bids: [{ price: 49990, quantity: 1, total: 1 }],
        asks: [{ price: 49991, quantity: 1, total: 1 }],
      },
      status: ConnectionStatus.Live,
    });
    const { rerender } = render(<OrderbookViewer tickersInfo={tickersInfo} />);

    mockUseOrderbookStream.mockReturnValue({
      orderbookData: mockOrderbookData,
      status: ConnectionStatus.Live,
    });
    rerender(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByLabelText("Price going up")).toBeInTheDocument();
  });

  it("shows down arrow when mid price decreases", () => {
    mockUseOrderbookStream.mockReturnValue({
      orderbookData: mockOrderbookData,
      status: ConnectionStatus.Live,
    });
    const { rerender } = render(<OrderbookViewer tickersInfo={tickersInfo} />);

    mockUseOrderbookStream.mockReturnValue({
      orderbookData: {
        lastUpdateId: 2,
        bids: [{ price: 49990, quantity: 1, total: 1 }],
        asks: [{ price: 49991, quantity: 1, total: 1 }],
      },
      status: ConnectionStatus.Live,
    });
    rerender(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByLabelText("Price going down")).toBeInTheDocument();
  });

  it("shows dashes for mid price and spread when no data", () => {
    render(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("direction remains when mid price does not change", () => {
    mockUseOrderbookStream.mockReturnValue({
      orderbookData: {
        lastUpdateId: 1,
        bids: [{ price: 49990, quantity: 1, total: 1 }],
        asks: [{ price: 49991, quantity: 1, total: 1 }],
      },
      status: ConnectionStatus.Live,
    });
    const { rerender } = render(<OrderbookViewer tickersInfo={tickersInfo} />);

    mockUseOrderbookStream.mockReturnValue({
      orderbookData: mockOrderbookData,
      status: ConnectionStatus.Live,
    });
    rerender(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByLabelText("Price going up")).toBeInTheDocument();

    rerender(<OrderbookViewer tickersInfo={tickersInfo} />);
    expect(screen.getByLabelText("Price going up")).toBeInTheDocument();
    expect(screen.queryByLabelText("Price going down")).not.toBeInTheDocument();
  });
});
