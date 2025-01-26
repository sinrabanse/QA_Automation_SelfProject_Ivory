import { test, expect } from "@playwright/test";
import { testStandardCustomer } from "../utils/testCustomers.js";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import fs from "fs/promises";
import { testReporting } from "../utils/testReporting.js";
import { testAssertions } from "../utils/testAssertions.js";

const loadTestCases = async (filePath) => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const stepActions = {
  "Open product URL": async (page) => {
    await page.goto(testURL.iPhone16BlueURL);
  },
  "Push 20 times on '+' button": async (page) => {
    for (let i = 0; i < 20; i++) {
      await page.locator(testLocators.addAmountProductButton).click();
    }
  },
  "Verify error message": async (page) => {
    await expect(page.locator(testLocators.errorAmountProductField)).toHaveText(
      testAssertions.error_amount_product_text
    );
  },
};

const testCases = await loadTestCases(
  "./tests/test_suits/functionality_suits.json"
);

const tc = testCases.functionality_tests.find((tc) => tc.id === "6");

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
