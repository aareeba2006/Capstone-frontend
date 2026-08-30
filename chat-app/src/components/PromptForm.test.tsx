import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PromptForm } from "./PromptForm";

describe("PromptForm", () => {
  it("submits a valid message and clears the field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Message");
    await user.type(input, "Hello world");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onSubmit).toHaveBeenCalledWith("Hello world");
    expect(input).toHaveValue("");
  });

  it("shows a validation error for an empty message and does not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByRole("alert")).toHaveTextContent("can't be empty");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a validation error for an over-length message", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Message");
    await user.type(input, "a".repeat(501));
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByRole("alert")).toHaveTextContent("under 500 characters");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
