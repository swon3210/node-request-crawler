const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const Json2csvParser = require("json2csv").Parser;

const URLS = [
  "https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1?ref_=nv_sr_1",
  "https://www.imdb.com/title/tt2267998/?ref_=nv_sr_1?ref_=nv_sr_1"
]

async function crawler () {

  let movieData = [];

  for (let movie of URLS) {
    const response = await rp({
      uri: movie,
      headers: {
        "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding" : "gzip, deflate, br",
        "accept-language" : "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
        "cache-control" : "max-age=0",
        "sec-fetch-mode" : "navigate",
        "sec-fetch-site" : "none",
        "sec-fetch-user" : "?1",
        "upgrade-insecure-requests" : "1",
        "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
      },
      gzip: true
    });
  
    let $ = cheerio.load(response);
  
    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('span[itemprop="ratingValue"]').text();
    let poster = $("div[class='slate_wrapper'] > div[class='poster'] > a > img").attr('src');
    let totalRating = $("div[class='imdbRating'] > a > span[class='small']").text();
    let releaseDate = $("div[class='titleBar'] > div[class='title_wrapper'] > div[class='subtext'] > a[title='See more release dates']").text().trim();
    let genreList = [];
    $("div[class='titleBar'] > div[class='title_wrapper'] > div[class='subtext'] > a[href^='/search/']").each((i, el) => { genreList.push($(el).text()) })
    let test = $("#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div:nth-child(5) > div.titleReviewBarSubItem > div:nth-child(2) > span").text();

    console.log(test);
    const result = {
      title,
      rating,
      poster,
      totalRating,
      releaseDate,
      genreList
    }
    movieData.push(result);
  }



  // 특정 열만 뽑아서 csv 로 변환하고 싶다면
  // const fields = ["title", "rating"];
  // const json2csvParser = new Json2csvParser({ fields });
  
  const json2csvParser = new Json2csvParser()
  
  const csv = json2csvParser.parse(movieData);

  

  // fs.writeFileSync('./data.json', JSON.stringify(movieData), 'utf-8');

  // fs.writeFileSync('./data.csv', csv, 'utf-8');
  // console.log(csv);

}

crawler();