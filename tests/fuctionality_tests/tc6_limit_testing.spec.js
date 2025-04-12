import { test, expect } from "@playwright/test";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import { testAssertions } from "../utils/testAssertions.js";
import { executeTestSteps } from "../utils/executeTestSteps.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const stepActions = {
  "Open product URL": async (page) => {
    await page.goto(testURL.iPhone16BlueURL);
    await expect(page).toHaveURL(testURL.iPhone16BlueURL);
  },
  "Push 20 times on '+' button": async (page) => {
    await page.locator(testLocators.addAmountProductButton).waitFor();
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
