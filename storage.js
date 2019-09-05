const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  keyFilename: "my-user-project-249107-3648ae3c042a.json",
  projectId: "my-user-project-249107"
});

async function upload (bucketName, filename) {
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  }).then(() => {
    console.log(`${filename} uploaded to ${bucketName}.`);
  });
  
}

module.exports = upload;