const puppeteer = require("puppeteer");


(async () => {

  const console_func = (hey) => {
    console.log(hey);
  }

  const browser = puppeteer.launch({
    headless: false
  })
  
  const page = browser.newPage();

  await page.goto("https://www.google.com");

  // 만일 브라우저 스코프 바깥의 내가 정의한 함수를 사용하고 싶다면 따로 등록작업이 필요하다.

  await page.exposeFunction('console_func', (hey) => {
    console_func(hey);
  })

  // evaluate을 통해 스코프 내에 실행할 함수를 넣는다. 함수는 무조건 비동기여야 하기 때문에 async와 await를 써야한다.
  let details = await page.evaluate(async () => {
    let get_innertext = selector => {
      return document.querySelector(selector) ? document.querySelector(selector).innerText : false
    }

    // 이건 예시다. 동작 안할거다
    return {
      title: await console_func(get_innertext('h1[class="site-title"]'))
    }
  }) 

  

})();



