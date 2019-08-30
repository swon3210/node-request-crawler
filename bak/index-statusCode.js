const rp = require("request-promise");
// request.debug = 1;
// 만약 디버깅을 더 편리하게 하고 싶다면

async function crawler () {
  console.log('Initial Request');

  // 300 이상의 스테이터스 코드는 request 라이브러리에서 에러를 throw할 것이다.
  // 하지만 어떤 웹 사이트는 로그인 처리를 할 때 리다이렉트(300)를 활용한다. 이럴 때를 대비해서 그런
  // 상황에 대한 예외처리를 해야한다.
  let status = await rp({
    uri: 'https://httpbin.org/status/300',
    resolveWithFullResponse: true
  }).then(res => {
    console.log(res);
  })
  .catch(err => {
    if (err.statusCode === 300) {
      console.log("just a redirection");
    } else {
      console.log("there is an error", err);
      process.exit(1);
    }
  });

}

crawler();