import { test, expect } from "@playwright/test";
import { testStandardCustomer } from "../utils/testCustomers.js";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import { mockPaymentHandler } from "../utils/mockPaymentHandler.js";
import { executeTestSteps } from "../utils/executeTestSteps.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { testUIElements } from "../utils/testUIElements.js";

const assertData = {};

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
  "Select the product category": async (page) => {
    await page.locator(testLocators.checkboxFilterPhones).click();
    await page.locator(testLocators.applyFilterButton).click();
    await expect(page.locator(testLocators.checkboxFilterPhones)).toBeChecked();
    expect(page.url()).toBe(testURL.filteredIPhone16URL);
  },
  "Select the product": async (page) => {
    await page.locator(testLocators.iPhone16BlueCart).click();
    assertData.priceProduct = await page
      .locator(testLocators.priceProductInCard)
      .innerText();
  },
  "Select fast order": async (page) => {
    await page.locator(testLocators.buyNowButton).click();
    await page.locator(testLocators.closeRecommendationButton).click();
    expect(page.url()).toBe(testURL.cartUrl);
    const priceProductInCart = await page
      .locator(testLocators.priceProductInCart)
      .innerText();
    const priceProductInCartClean = priceProductInCart
      .replace(/[^\d,]/g, "")
      .trim();
    expect(priceProductInCartClean).toBe(assertData.priceProduct);
    await page.locator(testLocators.firstContinueButton).click();
  },
  "Choose delivery type": async (page) => {
    await page.waitForTimeout(2000); // technical pause
    await page.locator(testLocators.chooseShopDropDown).click();
    await page
      .locator(testLocators.shopSearchField)
      .fill(testStandardCustomer.city);
    await page.locator(testLocators.chooseHolonShop).click();
    await page.locator(testLocators.secondContinueButton).click();
    await page.waitForURL(testURL.personalInfoURL);
    expect(page.url()).toBe(testURL.personalInfoURL);
  },
  "Fill in customer details": async (page) => {
    await page
      .locator(testLocators.fastBuyFullNameField)
      .fill(testStandardCustomer.name);
    await page
      .locator(testLocators.fastBuyEmailField)
      .fill(testStandardCustomer.email);
    await page
      .locator(testLocators.fastBuyPhoneField)
      .fill(testStandardCustomer.phone);
    await page
      .locator(testLocators.fastBuyCityField)
      .fill(testStandardCustomer.city);
    await expect(page.locator(testLocators.fastBuyCityField)).toHaveValue(
      testStandardCustomer.city
    );
    await page.locator(testLocators.fastBuyStreetNameField).click();
    await page
      .locator(testLocators.fastBuyStreetNameField)
      .fill(testStandardCustomer.street);
    await page.keyboard.press("Backspace");
    await page
      .locator(
        "//li[@data-title='%u05D1%u05DF%20%u05D9%u05D4%u05D5%u05D3%u05D4']"
      )
      .click(); //choose option in drop-down list
    await page
      .locator(testLocators.fastBuyHomeNumberField)
      .fill(testStandardCustomer.home_number);
    await page.getByText(testUIElements.termsOfUseCheckboxText).click();
    await page.locator(testLocators.submitOrderFormButton).click();
    await page.waitForURL(testURL.paymentOptionURL);
    expect(page.url()).toBe(testURL.paymentOptionURL);
  },
  "Fill in payment details": async (page) => {
    await page.locator(testLocators.chooseNumberOfPaymentsField).click();
    await page
      .locator(testLocators.chooseNumberOfPaymentsField)
      .selectOption("0");
    await page.locator(testLocators.payWithCreditCardButton).click();
    await page.waitForSelector(testLocators.paymentFrame);
    const frame = page.frameLocator(testLocators.paymentFrame);
    await frame
      .locator(testLocators.paymentNameField)
      .fill(testStandardCustomer.name);
    await frame
      .locator(testLocators.paymentPassportField)
      .fill(testStandardCustomer.personal_id);
    await frame
      .locator(testLocators.paymentPhoneField)
      .fill(testStandardCustomer.phone);
    await frame
      .locator(testLocators.paymentCardNumberField)
      .fill(testStandardCustomer.card_number);
    await frame
      .locator(testLocators.paymentCardExpMonthField)
      .selectOption(testStandardCustomer.exp_month);
    await frame
      .locator(testLocators.paymentCardExpYearField)
      .selectOption(testStandardCustomer.exp_year);
    await frame
      .locator(testLocators.paymentCVVField)
      .fill(testStandardCustomer.cvv);
  },
  "Complete payment": async (page) => {
    const frame = page.frameLocator(testLocators.paymentFrame);
    await mockPaymentHandler(page, testLocators);
    const consoleMessages = [];
    page.on("console", (msg) => consoleMessages.push(msg.text()));
    await page.waitForTimeout(2000); // technical pause for loading data
    console.log("Console messages1:", consoleMessages);
    await frame.locator(testLocators.submitOrderButton).click();
    page.on("console", (msg) => consoleMessages.push(msg.text()));
    await page.waitForTimeout(2000); // technical pause for loading data
    console.log("Console messages2:", consoleMessages);
    expect(
      consoleMessages.some((msg) =>
        msg.includes("Payment processed successfully")
      )
    ).toBeTruthy();
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

test(tc.title, async ({ page }, testInfo) => {
  if (testInfo.project.name !== "chromium") {
    test.skip(); //this test only in Chrome
  }
  test.setTimeout(120_000);
  page.setDefaultTimeout(60000);
  await executeTestSteps(tc, page, stepActions);
});
