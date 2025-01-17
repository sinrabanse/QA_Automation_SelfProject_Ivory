import { test, expect } from "@playwright/test";
import { getCustomerFieldById } from "../utils/moduleDB.js";

test.describe("test_first", () => {
  test("testing_test", async ({ page }) => {
    await page.goto("https://www.ivory.co.il/");
    await page.getByRole("textbox", { name: 'חפש/י מוצר/ים או מק"ט' }).click();
    await page
      .getByRole("textbox", { name: 'חפש/י מוצר/ים או מק"ט' })
      .fill("iphone 16");
    await page.locator("#searchButton").click();
    await page.getByText("טלפונים סלולרים וסמארטפונים (21)").click();
    await page.getByRole("button", { name: "אישור" }).click();
    await page
      .getByRole("link", {
        name: "אייפון Apple iPhone 16 128GB בצבע כחול אייפון Apple iPhone 16 128GB בצבע כחול 3",
      })
      .click();
    await page.getByRole("button", { name: "קנה עכשיו" }).click();
    await page.locator("#buy_get_close").click();
    await page.getByLabel("המשך לשלב הבא - סכום ₪").click();
    await page.getByRole("textbox", { name: "בחר/י סניף" }).click();
    await page.getByLabel("בחר סניף לאיסוף עצמי מתוך 42").fill("חולון");
    await page.getByRole("treeitem", { name: "חולון" }).click();
    await page.getByRole("button", { name: "המשך" }).click();

    // await page.getByPlaceholder("שם מלא *").fill("אלכס ארח");
    getCustomerFieldById("standard_user", ["name"])
      .then(async (data) => {
        const clientName = data.name;
        await page.getByPlaceholder("שם מלא *").fill(clientName);
        console.log("Имя клиента вставлено:", clientName);
      })
      .catch((err) => {
        console.error("Ошибка:", err.message);
      });

    await page.getByPlaceholder("אימייל *").fill("testingtest@gmail.com");
    await page.getByPlaceholder("טלפון סלולרי *").fill("0548998877");
    await page.getByPlaceholder("עיר, יישוב, מושב או קיבוץ").fill("ח");
    expect(
      await page.getByLabel("פרטים אישיים").getByText("חולון").isEnabled()
    ).toBeTruthy();
    await page.getByLabel("פרטים אישיים").getByText("חולון").click();
    await page.getByPlaceholder("רחוב *").fill("בן יהוד");
    expect(page.getByText("בן יהודה").isEnabled());
    await page.getByText("בן יהודה").click();
    await page.getByPlaceholder("מספר בית *").fill("123");
    await page
      .getByText(
        "אני מאשר/ת כי קראתי, הבנתי והסכמתי לתנאי השימוש ולמדיניות הפרטיות *"
      )
      .click();

    await page.getByRole("button", { name: "אישור" }).click();
    await page
      .getByLabel(
        "בחר מספר תשלומים *כמות תשלומים: 1כמות תשלומים: 2כמות תשלומים: 3כמות תשלומים: 4"
      )
      .selectOption("0");

    // await page.pause();
    await page.getByRole("button", { name: "תשלום בכרטיס אשראי" }).click();
    await page.locator("#cciframewindow").waitFor({ state: "attached" });
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByPlaceholder("שם בעל הכרטיס")
      .fill("Tester Number One");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByPlaceholder("מספר ת.ז")
      .fill("345935829");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByPlaceholder("מספר טלפון בעל הכרטיס")
      .fill("0548998877");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByPlaceholder("מספר כרטיס")
      .fill("4111111111111111");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByLabel("תוקף כרטיס חודש")
      .selectOption("12");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByLabel("תוקף כרטיס שנה")
      .selectOption("29");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByPlaceholder("CVV")
      .fill("123");
    await page
      .locator("#cciframewindow")
      .contentFrame()
      .getByLabel(
        "סך הכל לתשלום 3685.00₪ - בצע תשלום - לאחר לחיצה על תשלום יש להמתין עד לקבלת מספר הזמנה",
        { exact: true }
      )
      .click();
    await page.pause();
  });
});
