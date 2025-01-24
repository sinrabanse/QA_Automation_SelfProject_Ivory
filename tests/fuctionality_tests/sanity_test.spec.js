import { test, expect } from "@playwright/test";
import { testStandardCustomer } from "../utils/testCustomers.js";
import { testLocators } from "../utils/testLocators.js";
import { testURL } from "../utils/testURL.js";
import { mockPaymentHandler } from "../utils/mockPaymentHandler.js";
import fs from "fs/promises";

const loadTestCases = async (filePath) => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const stepActions = {
  "Open website": async (page) => {
    await page.goto(testURL.mainURL);
  },
  "Search for 'iPhone 16'": async (page) => {
    await page.locator(testLocators.searchPanel).fill("iphone 16");
    await page.locator(testLocators.serachButton).click();
  },
  "Select the product category": async (page) => {
    await page.locator(testLocators.checkboxFilterPhones).click();
    await page.locator(testLocators.applyFilterButton).click();
  },
  "Select the product": async (page) => {
    await page.locator(testLocators.iPhone16BlueCart).click();
  },
  "Select fast order": async (page) => {
    await page.locator(testLocators.buyNowButton).click();
    await page.locator(testLocators.closeRecommendationButton).click();
    await page.locator(testLocators.firstContinueButton).click();
  },
  "Choose delivery type": async (page) => {
    await page.locator(testLocators.chooseShopDropDown).click();
    await page
      .locator(testLocators.shopSearchField)
      .fill(testStandardCustomer.city);
    await page.locator(testLocators.chooseHolonShop).click();
    await page.locator(testLocators.secondContinueButton).click();
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
    // await page.locator(testLocators.fastBuyStreetNameField).click();
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
    await page
      .getByText(
        "אני מאשר/ת כי קראתי, הבנתי והסכמתי לתנאי השימוש ולמדיניות הפרטיות *"
      )
      .click(); //terms of use checkbox
    await page.locator(testLocators.submitOrderFormButton).click();
  },
  "Fill in payment details": async (page) => {
    await page.locator(testLocators.chooseNumberOfPaymentsField).click();
    await page
      .locator(testLocators.chooseNumberOfPaymentsField)
      .selectOption("0");
    await page.locator(testLocators.payWithCreditCardButton).click();
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
    await page.waitForTimeout(2000); // Подождите выполнения запроса
    console.log("Console messages1:", consoleMessages);
    await frame.locator(testLocators.submitOrderButton).click();
    page.on("console", (msg) => consoleMessages.push(msg.text()));
    await page.waitForTimeout(2000); // Подождите выполнения запроса
    console.log("Console messages2:", consoleMessages);
    expect(
      consoleMessages.some((msg) =>
        msg.includes("Payment processed successfully")
      )
    ).toBeTruthy();
  },
};

const testCases = await loadTestCases(
  "./tests/test_suits/functionality_suits.json"
);

const tc1 = testCases.functionality_tests.find((tc) => tc.id === "TC1");

test(tc1.title, async ({ page }) => {
  console.log(`Executing test: ${tc1.title}`);
  test.setTimeout(60000);
  for (const step of tc1.steps) {
    console.log(`Executing step: ${step}`);
    if (stepActions[step]) {
      await stepActions[step](page);
    } else {
      console.warn(`No implementation found for step: ${step}`);
    }
  }
});
