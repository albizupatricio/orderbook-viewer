import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderbookFooter } from "./OrderbookFooter";

const onLevelsChange = jest.fn();

const baseProps = {
  selectedLevels: 10,
  levelsOptions: [10, 20],
  onLevelsChange,
};

describe("OrderbookFooter", () => {
  beforeEach(() => {
    onLevelsChange.mockClear();
  });

  it("renders BID VOLUME and ASK VOLUME legend", () => {
    render(<OrderbookFooter {...baseProps} />);
    expect(screen.getByText("BID VOLUME")).toBeInTheDocument();
    expect(screen.getByText("ASK VOLUME")).toBeInTheDocument();
  });

  it("renders levels options", () => {
    render(<OrderbookFooter {...baseProps} />);
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
  });

  it("marks selected level as pressed", () => {
    render(<OrderbookFooter {...baseProps} />);
    expect(screen.getByRole("button", { name: "10" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "20" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onLevelsChange when level is changed", async () => {
    render(<OrderbookFooter {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onLevelsChange).toHaveBeenCalledWith(20);
  });

  it("renders LEVELS label", () => {
    render(<OrderbookFooter {...baseProps} />);
    expect(screen.getByText("LEVELS")).toBeInTheDocument();
  });

  it("legend color blocks are decorative", () => {
    const { container } = render(<OrderbookFooter {...baseProps} />);
    const decorativeBlocks = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorativeBlocks).toHaveLength(2);
  });
});
