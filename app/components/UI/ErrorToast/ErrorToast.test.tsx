import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorToast } from "./ErrorToast";

jest.mock("framer-motion");

describe("ErrorToast", () => {
  const message = "Something went wrong";
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it("renders the error toast", () => {
    render(<ErrorToast message={message} onClose={onClose} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    render(<ErrorToast message={message} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has alert role", () => {
    render(<ErrorToast message={message} onClose={onClose} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
