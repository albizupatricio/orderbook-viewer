import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip";

describe("Chip", () => {
  const textColorClass = "text-red-500";
  const borderColorClass = "border-red-500";
  const backgroundColorClass = "bg-red-100";

  it("renders children", () => {
    render(<Chip textColorClass={textColorClass}>Test</Chip>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies textColorClass", () => {
    render(<Chip textColorClass={textColorClass}>Test</Chip>);
    expect(screen.getByText("Test")).toHaveClass(textColorClass);
  });

  it("applies optional borderColorClass and backgroundColorClass", () => {
    render(
      <Chip
        textColorClass={textColorClass}
        borderColorClass={borderColorClass}
        backgroundColorClass={backgroundColorClass}
      >
        Test
      </Chip>,
    );
    const chip = screen.getByText("Test");
    expect(chip).toHaveClass(borderColorClass);
    expect(chip).toHaveClass(backgroundColorClass);
  });

  it("renders with role when provided", () => {
    render(
      <Chip textColorClass={textColorClass} role="status">
        Test
      </Chip>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
