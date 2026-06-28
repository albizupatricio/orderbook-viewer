import { render, screen } from "@testing-library/react";
import { PriceDirection } from "@/common-types/orderbook";
import { MarketSummary } from "./MarketSummary";

const baseProps = {
  pricePrecision: 2,
  spread: { absolute: 0.01, percentage: 0.000634 },
};

describe("MarketSummary", () => {
  it("renders mid price correctly", () => {
    render(<MarketSummary {...baseProps} midPrice={1577.38} />);
    expect(screen.getByText("1577.38")).toBeInTheDocument();
  });

  it("renders dash when midPrice is NaN", () => {
    render(<MarketSummary {...baseProps} midPrice={NaN} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders spread absolute and percentage", () => {
    render(<MarketSummary {...baseProps} midPrice={1577.38} />);
    expect(screen.getByText("0.01")).toBeInTheDocument();
    expect(screen.getByText("(0.000634%)")).toBeInTheDocument();
  });

  it("renders dash when spread is NaN", () => {
    render(
      <MarketSummary
        {...baseProps}
        midPrice={NaN}
        spread={{ absolute: NaN, percentage: NaN }}
      />,
    );
    const dashes = screen.getAllByText("—");
    expect(dashes).toHaveLength(2);
  });

  it("renders up arrow when direction is Up", () => {
    render(
      <MarketSummary
        {...baseProps}
        midPrice={1577.38}
        direction={PriceDirection.Up}
      />,
    );
    expect(screen.getByLabelText("Price going up")).toBeInTheDocument();
    expect(screen.getByLabelText("MID PRICE")).toHaveClass("text-ov-bid");
  });

  it("renders down arrow when direction is Down", () => {
    render(
      <MarketSummary
        {...baseProps}
        midPrice={1577.38}
        direction={PriceDirection.Down}
      />,
    );
    expect(screen.getByLabelText("Price going down")).toBeInTheDocument();
    expect(screen.getByLabelText("MID PRICE")).toHaveClass("text-ov-ask");
  });

  it("renders no arrow when direction is undefined", () => {
    render(<MarketSummary {...baseProps} midPrice={1577.38} />);
    expect(screen.queryByLabelText("Price going up")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Price going down")).not.toBeInTheDocument();
    expect(screen.getByLabelText("MID PRICE")).toHaveClass("text-ov-default");
  });

  it("has correct aria labels for mid price and spread", () => {
    render(<MarketSummary {...baseProps} midPrice={1577.38} />);
    expect(screen.getByLabelText("MID PRICE")).toBeInTheDocument();
    expect(screen.getByLabelText("SPREAD")).toBeInTheDocument();
  });
});
