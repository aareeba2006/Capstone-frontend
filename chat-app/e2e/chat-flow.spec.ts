import { test, expect } from "@playwright/test";

test("user sends a message and sees the assistant reply", async ({ page }) => {
  // Intercept the AI route so the e2e test never hits the real API.
  await page.route("/api/chat", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reply: "Mocked assistant reply" }),
    })
  );

  await page.goto("/");

  await page.getByLabel("Message").fill("Hello from Playwright");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Mocked assistant reply")).toBeVisible();
});
