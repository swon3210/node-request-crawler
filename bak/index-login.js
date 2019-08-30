const request = require("request-promise");
const cheerio = require("cheerio");

async function crawler () {
  let initialRequest = await request({
    uri: "http://quotes.toscrape.com/login",
    method: "GET",
    gzip: true,
    resolveWithFullResponse: true
  })

  const $ = cheerio.load(initialRequest.body);

  // 로그인 전의 쿠키 파싱하기

  let cookie = initialRequest.headers['set-cookie'].map(value => value.split(';')[0]).join(' ');

  const csrfToken = $("input[name='csrf_token']").val();

  console.log("POST Request to login on the form");

  let loginRequest = await request({
    uri: "http://quotes.toscrape.com/login",
    method: "POST",
    gzip: true,
    headers: {
      // 쿠키가 없으면 값은 얻겠지만 에러라고 표시되어 있을 것이다.
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie,
      "Host": "quotes.toscrape.com",
      "Origin": "http://quotes.toscrape.com",
      "Referer": "http://quotes.toscrape.com/login",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
    },
    formData: {
      "csrf_token": csrfToken,
      "username": "admin",
      "password": "admin"
    },
    resolveWithFullResponse: true // 서버의 모든 스테이터스 코드 응답에도 에러가 나지 않도록
  }).then(res => {
    console.log(res);
  }).catch(response => {
    // 로그인 한 뒤에 얻은 쿠키를 저장해야 함 
    cookie = response.response.headers['set-cookie'].map(value => value.split(';')[0]).join(' ');
    debugger;
  })

  console.log('logged in');

  let loggedInResponse = await request({
    uri: "http://quotes.toscrape.com/",
    method: "GET",
    gzip: true,
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "Host": "quotes.toscrape.com",
      "Origin": "http://quotes.toscrape.com",
      "Referer": "http://quotes.toscrape.com/login",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
    },
  })

  debugger;

}

crawler();