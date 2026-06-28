import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectionStatus } from "@/common-types/orderbook";
import { OrderbookHeader } from "./OrderbookHeader";

jest.mock("framer-motion");

const onTickerInfoChange = jest.fn();

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

const baseProps = {
  tickersInfo,
  status: ConnectionStatus.Live,
  onTickerInfoChange,
};

describe("OrderbookHeader", () => {
  beforeEach(() => {
    onTickerInfoChange.mockClear();
  });

  it("renders title", () => {
    render(<OrderbookHeader {...baseProps} />);
    expect(screen.getByText("Orderbook Viewer")).toBeInTheDocument();
  });

  it("renders connection status chip", () => {
    render(<OrderbookHeader {...baseProps} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("live")).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<OrderbookHeader {...baseProps} isLoading />);
    expect(screen.getByLabelText("Loading tickers")).toBeInTheDocument();
  });

  it("does not show loading spinner when isLoading is false", () => {
    render(<OrderbookHeader {...baseProps} />);
    expect(screen.queryByLabelText("Loading tickers")).not.toBeInTheDocument();
  });

  it("disables select when isLoading is true", () => {
    render(<OrderbookHeader {...baseProps} isLoading />);
    expect(
      screen.getByRole("button", { name: "Select ticker" }),
    ).toBeDisabled();
  });

  it("calls onTickerInfoChange when ticker is selected", async () => {
    render(<OrderbookHeader {...baseProps} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Select ticker" }),
    );
    await userEvent.click(screen.getByText("BTC/USDT"));
    expect(onTickerInfoChange).toHaveBeenCalledWith(tickersInfo[0]);
  });

  it("shows selected ticker in trigger", () => {
    render(<OrderbookHeader {...baseProps} selectedTicker={tickersInfo[0]} />);
    expect(
      screen.getByRole("button", { name: "Select ticker" }),
    ).toHaveTextContent("BTC/USDT");
  });

  it.each([
    [ConnectionStatus.Live, "live"],
    [ConnectionStatus.Connecting, "connecting"],
    [ConnectionStatus.Error, "error"],
    [ConnectionStatus.Disconnected, "disconnected"],
  ])("shows correct status text for %s", (status, text) => {
    render(<OrderbookHeader {...baseProps} status={status} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("has decorative icon with aria-hidden", () => {
    const { container } = render(<OrderbookHeader {...baseProps} />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });
});
