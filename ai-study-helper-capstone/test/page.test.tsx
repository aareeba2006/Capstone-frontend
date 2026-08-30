import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../app/page";

describe("AI Study Helper", () => {
  it("shows the main heading and question input", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /AI Study Helper/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Your question/i)).toBeInTheDocument();
  });
});
