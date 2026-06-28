import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchableSelect } from "./SearchableSelect";

jest.mock("framer-motion");

describe("SearchableSelect", () => {
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

  it("renders trigger with placeholder", () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Select test" }),
    ).toBeInTheDocument();
  });

  it("shows selected option label in trigger", () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
        selectedOption={{ value: "test", label: "Test" }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Select test" }),
    ).toHaveTextContent("Test");
  });

  it("opens dropdown on trigger click", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows options when open", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test 2")).toBeInTheDocument();
  });

  it("calls onChange and closes on option select", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    await userEvent.click(screen.getByText("Test"));
    expect(onChange).toHaveBeenCalledWith({ value: "test", label: "Test" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("filters options by search term", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    await userEvent.type(
      screen.getByPlaceholderText("Search by test"),
      "Test 2",
    );
    expect(screen.getByText("Test 2")).toBeInTheDocument();
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    await userEvent.type(screen.getByRole("textbox"), "XYZ");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
        disabled
      />,
    );
    expect(screen.getByRole("button", { name: "Select test" })).toBeDisabled();
  });

  it("closes dropdown on Escape key", async () => {
    render(
      <SearchableSelect
        options={options}
        onChange={onChange}
        maxVisible={maxVisible}
        optionLabel={optionLabel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Select test" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
