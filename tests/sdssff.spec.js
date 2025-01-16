import { test, expect } from "@playwright/test";

test.describe("test_first", () => {
  test("testing_test", async ({ page }) => {
    await page.goto("https://www.ivory.co.il/");
  });
});
