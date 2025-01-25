import { testUIElements } from "./testUIElements.js";

export const testLocators = {
  searchPanel: "//input[@id='qSearch']",
  serachButton: "//button[@id='searchButton']",
  checkboxFilterPhones:
    "//div[contains(@class, 'col-md-auto col-12 pr-2 pl-2 sinunLabelnewLabel d-flex')]//span[contains(@id, 'sinunTitle_2735') and contains(text(), 'טלפונים סלולרים וסמארטפונים')]",
  applyFilterButton:
    "//button[@class=' btn btn_filters hoverBtn filter-by-cats-btn']",
  iPhone16BlueCart: `//div[@class='col-md-12 col-12 title_product_catalog mb-md-1 main-text-area' and contains(text(), '${testUIElements.iPhone16BlueName}')]`,
  iPhone16BlackCart: `//div[@class='col-md-12 col-12 title_product_catalog mb-md-1 main-text-area' and contains(text(), '${testUIElements.iPhone16BlackName}')]`,
  iPhone16WhiteCart: `//div[@class='col-md-12 col-12 title_product_catalog mb-md-1 main-text-area' and contains(text(), '${testUIElements.iPhone16WhiteName}')]`,
  buyNowButton: "(//button[@id='fastBuy'])[2]",
  closeRecommendationButton: "//button[@id='buy_get_close']",
  firstContinueButton: "//a[@id='PopupShipping-btnJs_id']",
  chooseShopDropDown: "//span[@id='select2-selectCity_pic-container']",
  shopSearchField:
    "//input[@type='search' and contains(@aria-label, 'בחר סניף')]",
  chooseHolonShop: "//li[contains(text(), 'חולון') and @role='treeitem']",
  secondContinueButton:
    "//button[@type='button' and contains(@data-no-suboption-msg, 'יש לבחור את הסניף שממנו נרצה לאסוף את ההזמנה')]",
  fastBuyFullNameField: "//input[@data-save-address-fld='fname']",
  fastBuyEmailField: "//input[@data-save-address-fld='email']",
  fastBuyPhoneField: "//input[@data-save-address-fld='phone']",
  fastBuyCityField: "//input[@data-save-address-fld='city']",
  fastBuyStreetNameField: "//input[@data-save-address-fld='street_name']",
  fastBuyHomeNumberField: "//input[@data-save-address-fld='street_number']",
  submitOrderFormButton: "//button[@id='submit_order_form']",
  chooseNumberOfPaymentsField: "//select[@id='numberOfPayments']",
  payWithCreditCardButton:
    "//button[@type='button' and contains(text(), 'תשלום בכרטיס אשראי')]",
  paymentFrame: "//iframe[@id='cciframewindow']",
  paymentNameField: "//input[@id='userData2']",
  paymentPassportField: "//input[@id='personalId']",
  paymentPhoneField: "//input[@id='userData7']",
  paymentCardNumberField: "//input[@id='cardNumber']",
  paymentCardExpMonthField: "//select[@id='expMonth']",
  paymentCardExpYearField: "//select[@id='expYear']",
  paymentCVVField: "//input[@id='cvv']",
  submitOrderButton: "//button[@id='submitBtn']",
  addToCartButton: "(//button[@id='addToCart'])[2]",
  goToCartButton: "(//a[@class='cart-btn cart-target linkInited'])[1]",
};
