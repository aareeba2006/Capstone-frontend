import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";

// Mock the AI route so no real network/API call is ever made.
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ reply: "Mocked assistant reply" }),
    }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("sends a message and renders the mocked assistant reply", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Message"), "Hi there");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Mocked assistant reply")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/chat", expect.objectContaining({ method: "POST" }));
  });
});
