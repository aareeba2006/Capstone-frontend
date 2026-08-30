import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ToolResultCard } from "./ToolResultCard";

describe("ToolResultCard", () => {
  it("shows a success status and the output", () => {
    render(<ToolResultCard toolName="search" status="success" output="3 matches" />);
    const region = screen.getByLabelText("search result");
    expect(region).toHaveTextContent("Completed");
    expect(region).toHaveTextContent("3 matches");
    expect(screen.getByRole("status")).toHaveTextContent("Completed");
  });

  it("shows an error alert when the tool failed", () => {
    render(<ToolResultCard toolName="search" status="error" output="timeout" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });
});
