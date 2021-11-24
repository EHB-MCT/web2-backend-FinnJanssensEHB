"use strict";

import 'dotenv/config';
import * as v from 'vimeo';
import * as mdb from 'mongodb';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const access_token = process.env.ACCESS_TOKEN;

const mongo_uri = process.env.MONGO_URI;
const mongoClient = new mdb.MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dbName = 'Airbox';
const collectionName = 'Videos';

let vimeoClient = new v.Vimeo(client_id, client_secret, access_token);

let videos;

// let file_name = "test.m4v"
// client.upload(
//   file_name, {
//     'name': 'Test upload',
//     'description': 'This is a test of the Vimeo API'
//   },
//   function (uri) {
//     console.log('Your video URI is: ' + uri);
//   },
//   function (bytes_uploaded, bytes_total) {
//     var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
//     console.log(bytes_uploaded, bytes_total, percentage + '%')
//   },
//   function (error) {
//     console.log('Failed because: ' + error)
//   }
// )

function vimeoGetVideos() {
  vimeoClient.request({
    method: 'GET',
    path: '/me/videos'
  }, function (error, body, status_code, headers) {
    if (error) {
      console.log(error);
    } else {
      // console.log(body.data);
      videos = body.data;
      console.log("Type of videos: " + typeof (videos));
      insertDocuments(videos)
        .then(console.log)
        .catch(console.error)
        .finally(() => mongoClient.close());
    }
  })

  // const findResult = await collection.find({}).toArray();
  // console.log('Found documents =>', findResult);
  // for (var i = 0; i < videos.length; i++) {
  //   var video = videos[i];
  //   console.log(video.uri);
  // }
}

async function insertDocuments(documents) {
  await mongoClient.connect();
  console.log('Connected successfully to server');
  const db = mongoClient.db(dbName);
  const collection = db.collection(collectionName);
  const insertResult = await collection.insertMany(documents);
  console.log('Inserted documents =>', insertResult);
  return 'done';
}

vimeoGetVideos();

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => mongoClient.close());