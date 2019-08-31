// Instagram 크롤러 함수 (유저 이름)
const crawler = require('./crawler.js');

// 파이어스토어 데이터베이스 컨트롤 객체
const db = require('./fb.js');

// GCS 업로더 함수
const gcs_upload = require('./storage.js');

// Node JS 모듈
const fs = require("fs");
const path = require("path");

// 익스프레스 프레임워크
const express = require("express");
const app = express();

// 환경변수 가져오기
require('dotenv').config();
const request = require("request-promise");

app.listen(process.env.SERVER_PORT, () => {
  console.log(`서버가 ${process.env.SERVER_PORT} 번 포트에서 열렸습니다.`);
});

app.get('/', (req, res, next) => {
  res.send('안녕하세요!');
})

app.get('/crawler/:username', (req, res, next) => {
  const username = req.params.username;
  
  crawler(username).then(result_obj => {
    // 크롤러에서 가져온 데이터 중 일부만 저장하고자 함.

    const user_profile_id = result_obj.instagram_user_profile.id;

    const user_profile_obj = {
      followers: result_obj.instagram_user_profile.followers,
      following: result_obj.instagram_user_profile.following,
      uploads: result_obj.instagram_user_profile.uploads,
      full_name: result_obj.instagram_user_profile.full_name,
      picture_url: result_obj.instagram_user_profile.picture_url,
    }

    // 음 이렇게 하면 콜백지옥이랑 다를게 없는데, 역시 더 생각해보자.

    const user_posts = result_obj.instagram_user_recent_posts;

    db.collection("instagram_users").doc(user_profile_id).set(user_profile_obj)
      .then(() => {
        console.log('프로필 등록 성공!')
        for (let user_post of user_posts) {
          const user_post_id = user_post.id
        
          const user_post_obj = {
            user_id: user_profile_id,
            timestamp: user_post.timestamp,
            caption: user_post.caption,
            image_url: user_post.image_url
          };
          db.collection("instagram_posts").doc(user_post_id).set(user_post_obj)
            .then(() => {
              console.log('포스트 등록 성공!')
            }).catch(err3 => {
              console.log('포스트 등록 실패!', err3);
            })
        }

        res.send(`${user_profile_obj.full_name}의 프로필 등록 완료!`);
      }).catch(err2 => {
      console.log('프로필 등록 실패!', err2);

      // }).then(() => {
      //   db.collection("instagram_users").collection(user_profile.full_name).add(user_posts);
      //   res.send(`${user_profile.full_name}의 크롤링 완료!`);
      // })

    }).catch(err => {
      console.log('전체 등록 실패!', err);
    });

  });

  // request(img_url).pipe(fs.createWriteStream('./photos/' + img_name));

});

app.get('/upload', (req, res, next) => {
  // 로컬 파일 자체를 저장하는 것은 좀 그렇겠구만
});

app.get('/download', (req, res, next) => {
  
  // 이름에 따라 따로 다운로드가 가능하게 해야겠는데
  db.collection("instagram_posts").get().then((snapshot) => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        const image_url = data.image_url;
        const image_name = String(data.timestamp);

        (async () => {
          await request(image_url).on("response", () => {
            console.log('hey!')
          }).pipe(fs.createWriteStream(image_name + '.jpg'));

          await gcs_upload('song-bucket', image_name + '.jpg').then(async () => {
            await fs.unlink(image_name + '.jpg', (err) => {
              if (err) {
                console.log(err);
              }
              console.log('deleted!');
            });
          }).catch(error => {
            console.log(error)
          });
        })();
      });
    }
    res.send('완료!');
  }).catch(err => {
    console.log(err);
  }).then();


  // fs.mkdir(`./instagram/${}`)
  // let img = request('https://scontent-icn1-1.cdninstagram.com/vp/569cd32c0741f663c09c8ef82cd270d6/5E04AACC/t51.2885-15/e35/69218305_2348720548716712_311025405392218625_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com');

  // res.download(img);
});

app.get('/', (req, res, next) => {
  
});

module.exports = {
  app
};


