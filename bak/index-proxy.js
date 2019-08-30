const rp = require("request-promise").defaults({
  proxy: "http://user:passwordgip:prot"
  // 이곳에 프록시 서버의 정보를 담으면, request 요청이 해당 프록시 서버를 통해
  // 이루어지고, 응답을 받을 때도 해당 프록시 서버를 통해서 받게 된다.

})

async function crawler () {
  let response = await rp("")
}

crawler()