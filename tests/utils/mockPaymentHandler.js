export async function mockPaymentHandler(page, testLocators) {
  // We intercept all requests on the page and inside frames
  page.on("route", (route, request) => {
    const url = request.url();
    console.log("Intercepted request to:", url);
    if (url === "http://localhost:3000/api/payment") {
      console.log("Mocking payment request...");
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          message: "Fake payment successful",
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      route.continue();
    }
  });

  const frameLocator = page.locator(testLocators.paymentFrame);
  const frameElementHandle = await frameLocator.elementHandle();

  if (!frameElementHandle) {
    throw new Error("Unable to find frame with the given XPath");
  }

  // Getting the frame through the handle element
  const frame = await frameElementHandle.contentFrame();

  if (!frame) {
    throw new Error("Failed to get frame from element");
  }

  // Performing actions in a frame
  await frame.evaluate((locators) => {
    console.log("Simulating button click inside iframe...");

    const getXPathElement = (xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue;
    };

    const payButton = getXPathElement(locators.submitOrderButton);
    if (payButton) {
      payButton.onclick = async () => {
        const paymentData = {
          amount: 100,
          method: "credit_card",
          userId: "test_user",
        };

        try {
          const response = await fetch("http://localhost:3000/api/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          });

          const result = await response.json();
          console.log("Fake Payment Result:", result);
        } catch (error) {
          console.error("Fake payment failed:", error);
        }
      };
    }
  }, testLocators);
}
