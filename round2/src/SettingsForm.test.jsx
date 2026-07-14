import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  it("shows the success message on valid submit (happy path)", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Name"), "Areeba Khan");
    await user.type(screen.getByLabelText("Email"), "areeba@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Settings saved successfully.")
    ).toBeInTheDocument();
  });

  it("rejects an empty name", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Email"), "areeba@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("rejects a whitespace-only name", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Name"), "   ");
    await user.type(screen.getByLabelText("Email"), "areeba@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("rejects an email missing the @ symbol", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Name"), "Areeba Khan");
    await user.type(screen.getByLabelText("Email"), "areebaexample.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("rejects an email missing a domain", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Name"), "Areeba Khan");
    await user.type(screen.getByLabelText("Email"), "areeba@");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("defaults the notifications checkbox to checked", () => {
    render(<SettingsForm />);
    expect(screen.getByLabelText(/Email notifications/i)).toBeChecked();
  });
});
