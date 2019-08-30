const puppeteer = require('puppeteer');

(async () => {
  // 모바일에서 보이는 뷰를 스크랩하고 싶거나, 해당 페이지가 모바일에서만 볼 수 있을 때
  // 다양한 폰에 대한 정보가 담김
  // const devices = require('puppeteer/DeviceDescriptors');

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  // await page.emulate(devices['iPhone X']);
  
  await page.goto('https://www.instagram.com/');

  // 셀렉터로 해당 요소를 찾을 수 있을 때까지 기다리라고 표기할 때
  await page.waitFor('a[href="/accounts/login/?source=auth_switcher"]')
  await page.click('a[href="/accounts/login/?source=auth_switcher"]')
  // 사람처럼 입력에 딜레이가 있어야 하는 경우가 있을 수 있다. // 만약 계정이 보호된 것이라면 스크래퍼로 로그인할 수 없다.
  await page.waitFor(500);
  await page.waitFor('input[name="username"]');
  await page.type('input[name="username"]', 'swon3210');
  await page.type('input[name="password"]', 'ahqkdlf#01');

  await page.click('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4) > button')

  
  // let title = await page.title();
  // console.log(`Title of the page is ${title}`);

  // let url = await page.url();
  // console.log(`URL of the page is ${url}`)
  
  // // pdf 를 쓰려면 headless 옵션을 true로 해야한다.
  // await page.pdf({
  //   path: './page.pdf',
  //   format: 'A4'
  // });
  
  // await page.type('.gLFyf ', 'World', {delay: 100})
  // await page.keyboard.press('Enter');
  // await page.waitForNavigation();
  // await page.screenshot({path: 'example.png'});

  debugger;

  await browser.close();
})();