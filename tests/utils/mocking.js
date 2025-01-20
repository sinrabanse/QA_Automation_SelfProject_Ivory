export async function mockingPayment(page) {
  await page.route("**", (route) => {
    console.log(
      `Перехвачен запрос на уровне страницы: ${route.request().url()}`
    );
    console.log("Метод:", route.request().method());
    console.log("Заголовки:", route.request().headers());
    console.log("Тело:", route.request().postData());

    // Пропускаем запрос
    route.continue();
  });
}

// Перехвачен запрос на уровне страницы: https://cgmpi.creditguard.co.il/CGMPI_Server/CG3DSInit?txId=0ebd2f32-4c18-45d0-aa9c-22c04e19158f
// Метод: POST
// Заголовки: {
//   accept: '*/*',
//   'accept-language': 'en-US',
//   'content-type': 'application/x-www-form-urlencoded',
//   origin: 'https://cgmpi.creditguard.co.il',
//   referer: 'https://cgmpi.creditguard.co.il/CGMPI_Server/PerformTransaction?txId=0ebd2f32-4c18-45d0-aa9c-22c04e19158f',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.33 Safari/537.36',
//   'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"Windows"'
// }
// Тело: cardNumber=4111111111111111
//             &expMonth=08
//             &expYear=29
//             &cvv=123

// Перехвачен запрос на уровне страницы: https://secure.safecharge.com/ppp/api/v1/websdk/initPaymentWithCardTokenization.do
// Метод: POST
// Заголовки: {
//   accept: '*/*',
//   'accept-language': 'en-US',
//   'content-type': 'application/json;charset=UTF-8',
//   origin: 'https://cgmpi.creditguard.co.il',
//   referer: 'https://cgmpi.creditguard.co.il/',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.33 Safari/537.36',
//   'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"Windows"'
// }
// Тело: {"sessionToken":"32f5e737-f3e3-42ab-a6fd-6ed38540006b","merchantId":"8532547826578668481","merchantSiteId":"208398","currency":"ILS","paymentOption":{"card":{"cardNumber":"4111111111111111","expirationMonth":"08","expirationYear":"29","CVV":"123","cardHolderName":"Name Name"},"useInitPayment":true},"sourceApplication":"WEB_SDK"}

// Перехвачен запрос на уровне страницы: https://secure.safecharge.com/ppp/api/v1/clientAuthorize3d.do
// Метод: POST
// Заголовки: {
//   accept: '*/*',
//   'accept-language': 'en-US',
//   'content-type': 'application/json;charset=UTF-8',
//   origin: 'https://cgmpi.creditguard.co.il',
//   referer: 'https://cgmpi.creditguard.co.il/',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.33 Safari/537.36',
//   'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"Windows"'
// }
// Тело: {"sessionToken":"32f5e737-f3e3-42ab-a6fd-6ed38540006b","merchantId":"8532547826578668481","merchantSiteId":"208398","paymentOption":{"card":{"cardNumber":"4111111111111111","expirationMonth":"08","expirationYear":"29","CVV":"123","cardHolderName":"Name Name","threeD":{"v2AdditionalParams":{"challengeWindowSize":"05"},"browserDetails":{"acceptHeader":"Y","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.33 Safari/537.36","javaEnabled":false,"language":"en-US","colorDepth":30,"screenHeight":1107,"screenWidth":1710,"timeZone":-120,"javaScriptEnabled":true},"platformType":"02","isDynamic3D":0,"notificationURL":"https://secure.safecharge.com/ppp/api/threeDSecure/completeVerify3d.do?sessionToken=32f5e737-f3e3-42ab-a6fd-6ed38540006b","version":"2.2.0","methodCompletionInd":"U"}}},"sourceApplication":"WEB_SDK","relatedTransactionId":"1120000002754875027"}

// Перехвачен запрос на уровне страницы: https://cgmpi.creditguard.co.il/CGMPI_Server/CG3DSOutcome?txId=0ebd2f32-4c18-45d0-aa9c-22c04e19158f
// Метод: POST
// Заголовки: {
//   accept: '*/*',
//   'accept-language': 'en-US',
//   'content-type': 'application/x-www-form-urlencoded',
//   origin: 'https://cgmpi.creditguard.co.il',
//   referer: 'https://cgmpi.creditguard.co.il/CGMPI_Server/PerformTransaction?txId=0ebd2f32-4c18-45d0-aa9c-22c04e19158f',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.33 Safari/537.36',
//   'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"Windows"'
// }
// Тело: transactionId=1120000002754875324&cancel=&cavv=&xid=b15ae23e-b73c-4ce4-ae79-18e7493920a9&eci=7&cg3dsVersion=2&cg3dsRawData={"result":"DECLINED","errCode":9075,"errorDescription":"3D Secure authentication failed, payment not allowed","userPaymentOptionId":"5150222418","cavv":"","eci":"7","xid":"","dsTransID":"b15ae23e-b73c-4ce4-ae79-18e7493920a9","threeDReason":"No Card record","threeDReasonId":"08","ccCardNumber":"4****1111","bin":"411111","last4Digits":"1111","ccExpMonth":"08","ccExpYear":"29","threeDVersion":"2.2.0","transactionId":"1120000002754875324","mcc":"","cancelled":false,"ccTempToken":"e0804784-e25a-48be-a9b0-501d211b509c"}
