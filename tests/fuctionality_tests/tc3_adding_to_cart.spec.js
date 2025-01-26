import { test, expect } from "@playwright/test";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import fs from "fs/promises";
import { testReporting } from "../utils/testReporting.js";

const loadTestCases = async (filePath) => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const stepActions = {
  "Open product URL": async (page) => {
    await page.goto(testURL.iPhone16BlueURL);
  },
  "Add product to cart": async (page) => {
    await page.waitForTimeout(2000); // technical pause for loading page
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
    await expect(page).toHaveURL(testURL.cartUrl);
  },
};

const testCases = await loadTestCases(
  "./tests/test_suits/functionality_suits.json"
);

const tc = testCases.functionality_tests.find((tc) => tc.id === "3");

test(tc.title, async ({ page }) => {
  console.log(`Executing test: ${tc.title}`);
  let currentStep = null;
  try {
    for (const step of tc.steps) {
      currentStep = step;
      console.log(`Executing step: ${step}`);
      if (stepActions[step]) {
        await stepActions[step](page);
      } else {
        console.warn(`No implementation found for step: ${step}`);
      }
    }
    await testReporting(tc.id, "Passed");
    console.log("Test passed successfully.");
  } catch (error) {
    console.error(`Test failed at step "${currentStep}": ${error.message}`);
    await testReporting(tc.id, "Failed", currentStep, error.message);
    throw error;
  }
});
