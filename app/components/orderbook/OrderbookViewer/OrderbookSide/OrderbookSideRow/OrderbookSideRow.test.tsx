import { render, screen } from "@testing-library/react";
import { OrderbookSideRow } from "./OrderbookSideRow";

const baseProps = {
  maxQuantity: 10,
  priceColorClass: "text-green-500",
  barColorClass: "bg-green-500",
  isBid: true,
  pricePrecision: 2,
  quantityPrecision: 4,
};

describe("OrderbookSideRow", () => {
  it("renders price and quantity when level is provided", () => {
    render(
      <OrderbookSideRow
        {...baseProps}
        level={{ price: 50000, quantity: 1.5, total: 1.5 }}
      />,
    );
    expect(screen.getByText("50000.00")).toBeInTheDocument();
    expect(screen.getByText("1.5000")).toBeInTheDocument();
  });

  it("renders nothing when level is undefined", () => {
    render(<OrderbookSideRow {...baseProps} />);
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("");
    expect(cells[1]).toHaveTextContent("");
  });

  it("renders decorative bar with correct width", () => {
    const { container } = render(
      <OrderbookSideRow
        {...baseProps}
        level={{ price: 50000, quantity: 5, total: 5 }}
      />,
    );
    const bar = container.querySelector('[aria-hidden="true"]');
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("renders bar with 0% width when level is undefined", () => {
    const { container } = render(<OrderbookSideRow {...baseProps} />);
    const bar = container.querySelector('[aria-hidden="true"]');
    expect(bar).toHaveStyle({ width: "0%" });
  });

  it("shows price on left and quantity on right for bids", () => {
    render(
      <OrderbookSideRow
        {...baseProps}
        isBid={true}
        level={{ price: 50000, quantity: 1.5, total: 1.5 }}
      />,
    );
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("50000.00");
    expect(cells[1]).toHaveTextContent("1.5000");
  });

  it("shows quantity on left and price on right for asks", () => {
    render(
      <OrderbookSideRow
        {...baseProps}
        isBid={false}
        level={{ price: 50000, quantity: 1.5, total: 1.5 }}
      />,
    );
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("1.5000");
    expect(cells[1]).toHaveTextContent("50000.00");
  });

  it("positions bar on the right for bids", () => {
    const { container } = render(
      <OrderbookSideRow
        {...baseProps}
        isBid={true}
        level={{ price: 50000, quantity: 5, total: 5 }}
      />,
    );
    const bar = container.querySelector('[aria-hidden="true"]');
    expect(bar).toHaveClass("right-0");
  });

  it("positions bar on the left for asks", () => {
    const { container } = render(
      <OrderbookSideRow
        {...baseProps}
        isBid={false}
        level={{ price: 50000, quantity: 5, total: 5 }}
      />,
    );
    const bar = container.querySelector('[aria-hidden="true"]');
    expect(bar).toHaveClass("left-0");
  });
});
