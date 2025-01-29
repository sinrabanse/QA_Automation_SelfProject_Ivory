import { test, expect } from "@playwright/test";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import { executeTestSteps } from "../utils/executeTestSteps.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { TIMEOUT } from "dns";

const stepActions = {
  "Open website": async (page) => {
    await page.goto(testURL.mainURL);
    await expect(page).toHaveURL(testURL.mainURL);
  },
  "Search for 'iPhone 16'": async (page) => {
    await page.locator(testLocators.searchPanel).fill("iphone 16");
    await page.locator(testLocators.serachButton).click();
    await page.waitForTimeout(2000); // technical pause for URL update
    expect(page.url()).toBe(testURL.searchIPhone16URL);
  },
  "Filter by product category": async (page) => {
    await page.locator(testLocators.checkboxFilterPhones).click();
    await page.locator(testLocators.applyFilterButton).click();
  },
  "Verify results": async (page) => {
    await expect(page.locator(testLocators.checkboxFilterPhones)).toBeChecked();
    expect(page.url()).toBe(testURL.filteredIPhone16URL);
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
