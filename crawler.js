const request = require("request-promise");
const cheerio = require("cheerio");

async function crawler (username) {
  const USERNAME = username;
  const BASE_URL = `https://instagram.com/${USERNAME}`

  let response = await request(BASE_URL);

  let $ = cheerio.load(response);

  // 동적으로 렌더링되는 웹사이트의 경우, 스크립트에서 로드되는 JSON 데이터를 읽어올 필요가 있다.
  let script = $("script[type='text/javascript']").eq(3).html();

  let script_regex = /{.*}/g .exec(script);

  let { entry_data: { ProfilePage: { [0] : { graphql: { user } } } } } = JSON.parse(script_regex[0]);

  const edges = user.edge_owner_to_timeline_media.edges;

  debugger;

  let instagram_user_recent_posts = [];

  for (let edge of edges) {
    let { node } = edge;

    instagram_user_recent_posts.push({
      id: node.id,
      shortcode: node.shortcode,
      timestamp: node.taken_at_timestamp,
      links: node.edge_liked_by.count,
      comments: node.edge_media_to_comment.count,
      video_views: node.video_view_count,
      caption: node.edge_media_to_caption.edges[0].node.text,
      image_url: node.display_url
    });
  }

  let instagram_user_profile = {
    id: user.id,
    followers: user.edge_followed_by.count,
    following: user.edge_follow.count,
    uploads: user.edge_owner_to_timeline_media.count,
    full_name: user.full_name,
    picture_url: user.profile_pic_url_hd
  }

  const instagram_data = {
    instagram_user_profile,
    instagram_user_recent_posts
  }

  const result = instagram_data

  return result;
}

// crawler('willsmith');

module.exports = crawler;
