const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  // 성능을 올리기 위해, 어떤 리소스는 아예 로드 자체를 안하도록 설정할 수 있다.
  // 하지만 어떤 웹사이트는 동작 자체를 위해 css나 이미지가 필요할 수도 있으니 주의하자
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    // if (request.resourceType() == 'image' || request.resourceType() == 'stylesheet') {
    if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  })

  await page.goto('https://amazon.com');

  debugger;

})();

