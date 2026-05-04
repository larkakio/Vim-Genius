import { test, expect } from "@playwright/test";

test.describe("Vim Genius progression", () => {
  test("sector 1 win unlocks Firewall maze title", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("vim-genius-progress-v1"));
    await page.reload();

    await expect(page.getByTestId("level-title")).toContainText("Boot sector");

    for (const d of ["k", "k", "l", "l"] as const) {
      await page.getByTestId(`move-${d}`).click();
    }

    await expect(page.getByTestId("level-title")).toContainText("Firewall maze", {
      timeout: 8000,
    });
  });
});
