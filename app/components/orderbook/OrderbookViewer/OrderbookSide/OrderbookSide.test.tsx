import { render, screen } from "@testing-library/react";
import { ConnectionStatus, Side } from "@/common-types/orderbook";
import { OrderbookSide } from "./OrderbookSide";

const baseProps = {
  side: Side.Bid,
  maxQuantity: 10,
  rows: 3,
  status: ConnectionStatus.Live,
  tickerInfo: {
    id: "BTCUSDT",
    displayName: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    pricePrecision: 2,
    quantityPrecision: 4,
  },
};

const mockLevels = [
  { price: 50000, quantity: 1.5, total: 1.5 },
  { price: 49999, quantity: 2.0, total: 3.5 },
  { price: 49998, quantity: 0.5, total: 4.0 },
];

describe("OrderbookSide", () => {
  it("shows empty state when no levels", () => {
    render(<OrderbookSide {...baseProps} levels={[]} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows correct message for Connecting status", () => {
    render(
      <OrderbookSide
        {...baseProps}
        levels={[]}
        status={ConnectionStatus.Connecting}
      />,
    );
    expect(
      screen.getByText("No data available yet — Connecting"),
    ).toBeInTheDocument();
  });

  it("shows correct message for Error status", () => {
    render(
      <OrderbookSide
        {...baseProps}
        levels={[]}
        status={ConnectionStatus.Error}
      />,
    );
    expect(
      screen.getByText("No data available — Connection error"),
    ).toBeInTheDocument();
  });

  it("renders rows when levels are provided", () => {
    render(<OrderbookSide {...baseProps} levels={mockLevels} />);
    expect(screen.getByText("50000.00")).toBeInTheDocument();
    expect(screen.getByText("49999.00")).toBeInTheDocument();
  });

  it("renders correct number of rows", () => {
    render(<OrderbookSide {...baseProps} levels={mockLevels} />);
    expect(screen.getAllByRole("row")).toHaveLength(baseProps.rows + 1);
  });

  it("has table role with correct aria-label for bids", () => {
    render(
      <OrderbookSide {...baseProps} levels={mockLevels} side={Side.Bid} />,
    );
    expect(screen.getByRole("table", { name: "Bids" })).toBeInTheDocument();
  });

  it("has table role with correct aria-label for asks", () => {
    render(
      <OrderbookSide {...baseProps} levels={mockLevels} side={Side.Ask} />,
    );
    expect(screen.getByRole("table", { name: "Asks" })).toBeInTheDocument();
  });

  it("shows correct message for Disconnected status", () => {
    render(
      <OrderbookSide
        {...baseProps}
        levels={[]}
        status={ConnectionStatus.Disconnected}
      />,
    );
    expect(
      screen.getByText("No data available — Disconnected"),
    ).toBeInTheDocument();
  });
});
