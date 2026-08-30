import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatMessage } from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders a text part", () => {
    render(<ChatMessage role="user" parts={[{ type: "text", text: "Hello there" }]} />);
    expect(screen.getByRole("group", { name: "user message" })).toHaveTextContent("Hello there");
  });

  it("renders a tool-call part as a status", () => {
    render(
      <ChatMessage
        role="assistant"
        parts={[{ type: "tool-call", toolName: "search", input: { q: "cats" } }]}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Calling tool: search");
  });

  it("renders a tool-result part with a labelled region", () => {
    render(
      <ChatMessage
        role="assistant"
        parts={[{ type: "tool-result", toolName: "search", output: "3 results found" }]}
      />
    );
    expect(screen.getByLabelText("search result")).toHaveTextContent("3 results found");
  });

  it("renders an error part as an alert", () => {
    render(<ChatMessage role="assistant" parts={[{ type: "error", message: "Tool failed" }]} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Tool failed");
  });

  it("renders multiple parts in order", () => {
    render(
      <ChatMessage
        role="assistant"
        parts={[
          { type: "text", text: "Let me check that." },
          { type: "tool-call", toolName: "search", input: {} },
          { type: "tool-result", toolName: "search", output: "done" },
        ]}
      />
    );
    const group = screen.getByRole("group", { name: "assistant message" });
    expect(group).toHaveTextContent("Let me check that.");
    expect(group).toHaveTextContent("Calling tool: search");
    expect(group).toHaveTextContent("done");
  });
});
