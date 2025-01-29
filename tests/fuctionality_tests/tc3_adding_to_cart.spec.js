import { test, expect } from "@playwright/test";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import { executeTestSteps } from "../utils/executeTestSteps.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const assertData = {};

const stepActions = {
  "Open product URL": async (page) => {
    await page.goto(testURL.iPhone16BlueURL);
    await expect(page).toHaveURL(testURL.iPhone16BlueURL);
    assertData.priceProduct = await page
      .locator(testLocators.priceProductInCard)
      .innerText();
  },
  "Add product to cart": async (page) => {
    await page.waitForTimeout(2000); // technical pause for adding to cart animation
    await page.locator(testLocators.addToCartButton).click();
    await expect(page.locator(testLocators.numberInTheCartIcon)).toHaveText(
      "1"
    );
    await page.locator(testLocators.closeRecommendationButton).click();
  },
  "Go to the cart": async (page) => {
    await page.locator(testLocators.goToCartButton).click();
  },
  "Verify results": async (page) => {
    expect(page.url()).toBe(testURL.cartUrl);
    const priceProductInCart = await page
      .locator(testLocators.priceProductInCart)
      .innerText();
    const priceProductInCartClean = priceProductInCart
      .replace(/[^\d,]/g, "")
      .trim();
    expect(priceProductInCartClean).toBe(assertData.priceProduct);
  },
};

// Loading test suit and test case
const testSuitPath = "./tests/test_suits/functionality_suits.json";
const __filename = fileURLToPath(import.meta.url);
const fileName = __filename.split("/").pop();
const testCaseId = fileName.match(/tc(\d+)/)[1]; // take number of test case from name of file
const loadTestCases = async (filePath) => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};
const testCases = await loadTestCases(testSuitPath);
const tc = testCases.functionality_tests.find((tc) => tc.id === testCaseId);

// Executing test

test(tc.title, async ({ page }) => {
  await executeTestSteps(tc, page, stepActions);
});
