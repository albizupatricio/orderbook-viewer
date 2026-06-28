import { render, screen } from "@testing-library/react";
import { OrderbookSideHeader } from "./OrderbookSideHeader";

const baseProps = {
  baseAsset: "BTC",
  quoteAsset: "USDT",
  priceColorClass: "text-green-500",
};

describe("OrderbookSideHeader", () => {
  it("renders Bids and BUY ORDERS for bid side", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    expect(screen.getByText("Bids")).toBeInTheDocument();
    expect(screen.getByText("BUY ORDERS")).toBeInTheDocument();
  });

  it("renders Asks and SELL ORDERS for ask side", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={false} />);
    expect(screen.getByText("Asks")).toBeInTheDocument();
    expect(screen.getByText("SELL ORDERS")).toBeInTheDocument();
  });

  it("renders PRICE with quoteAsset", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    expect(screen.getByText("PRICE (USDT)")).toBeInTheDocument();
  });

  it("renders QUANTITY with baseAsset", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    expect(screen.getByText("QUANTITY (BTC)")).toBeInTheDocument();
  });

  it("has columnheader roles on PRICE and QUANTITY", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent("PRICE (USDT)");
    expect(headers[1]).toHaveTextContent("QUANTITY (BTC)");
  });

  it("has rowgroup and row roles", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    expect(screen.getByRole("row")).toBeInTheDocument();
  });

  it("applies priceColorClass to the title", () => {
    render(<OrderbookSideHeader {...baseProps} isBid={true} />);
    expect(screen.getByText("Bids")).toHaveClass("text-green-500");
  });
});
