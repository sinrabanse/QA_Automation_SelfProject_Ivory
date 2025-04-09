import { test, expect } from "@playwright/test";
import { testStandardCustomer } from "../utils/testCustomers.js";
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
  "Select fast order": async (page) => {
    await page.waitForTimeout(2000); // technical pause for adding to cart animation
    await page.locator(testLocators.buyNowButton).click();
    await page.locator(testLocators.closeRecommendationButton).click();
    const priceProductInCart = await page
      .locator(testLocators.priceProductInCart)
      .innerText();
    const priceProductInCartClean = priceProductInCart
      .replace(/[^\d,]/g, "")
      .trim();
    expect(priceProductInCartClean).toBe(assertData.priceProduct);
    await page.locator(testLocators.firstContinueButton).click();
  },
  "Choose delivery type - Self Pickup": async (page) => {
    await page.waitForTimeout(2000); // technical pause
    await page.locator(testLocators.chooseShopDropDown).click();
    await page
      .locator(testLocators.shopSearchField)
      .fill(testStandardCustomer.city);
    await page.locator(testLocators.chooseHolonShop).click();
    await page.locator(testLocators.secondContinueButton).click();
  },
  "Verify results": async (page) => {
    await page.waitForURL(testURL.personalInfoURL);
    expect(page.url()).toBe(testURL.personalInfoURL);
  },
};

// Loading test suit and test case
const testSuitPath = "./tests/test_suits/functionality_suits.json";
const __filename = fileURLToPath(import.meta.url);
const fileName = __filename.split("/").pop();
const testCaseId = fileName.match(/tc(\d+)/)[1];
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
