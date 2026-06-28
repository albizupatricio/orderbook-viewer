import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  const options = ["A", "B"];
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it("renders all options", () => {
    render(<Toggle options={options} value="A" onChange={onChange} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("marks selected option as pressed", () => {
    render(<Toggle options={options} value="A" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with correct value when option is clicked", async () => {
    render(<Toggle options={options} value="A" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("B");
  });

  it("has group role with aria-labelledby when provided", () => {
    render(
      <Toggle
        options={options}
        value="A"
        onChange={onChange}
        ariaLabelledby="levels-label"
      />,
    );
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-labelledby",
      "levels-label",
    );
  });

  it("does not render aria-labelledby when not provided", () => {
    render(<Toggle options={options} value="10" onChange={onChange} />);
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-labelledby");
  });
});
