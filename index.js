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

// 업로더 패키지
const multer = require('multer');
const multerGoogleStorage = require("multer-google-storage");
const uploadHandler = multer({
  storage: multerGoogleStorage.storageEngine()
});

// 환경변수 가져오기
require('dotenv').config();

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
  res.send('업로드 완료!');
});

app.get('/download', (req, res, next) => {
  
});

app.get('/', (req, res, next) => {
  
});

module.exports = {
  app
};


