import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

jest.mock("./SearchableSelect", () => ({
  SearchableSelect: () => <div data-testid="searchable-select" />,
}));

describe("Select", () => {
  const options = [
    { value: "test", label: "Test" },
    { value: "test 2", label: "Test 2" },
  ];
  const onChange = jest.fn();
  const optionLabel = "test";
  const maxVisible = 5;

  beforeEach(() => {
    onChange.mockClear();
  });

  it("renders all options", () => {
    render(
      <Select
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test 2")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    render(
      <Select
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "test");
    expect(onChange).toHaveBeenCalledWith({ value: "test", label: "Test" });
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <Select
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
        disabled
      />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders SearchableSelect when searchable is true", () => {
    render(
      <Select
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
        searchable
      />,
    );
    expect(screen.getByTestId("searchable-select")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(
      <Select
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    expect(
      screen.getByRole("combobox", { name: "Select test" }),
    ).toBeInTheDocument();
  });
});
