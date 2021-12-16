"use strict";

import "dotenv/config";
import * as v from "vimeo";
import fs from "fs";

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const access_token = process.env.ACCESS_TOKEN;

const dbName = "Airbox";
const collectionName = "Videos";

let vimeoClient = new v.Vimeo(client_id, client_secret, access_token);

let videos;

function GetVideos() {
  return new Promise(function (resolve, reject) {
    vimeoClient.request(
      {
        method: "GET",
        path: "/me/videos",
      },
      function (error, body, status_code, headers) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // console.log(body.data);
          videos = body.data;
          let publicVideos = videos.filter(isPublicAndPlayable);
          let config = JSON.parse(fs.readFileSync("config.json"));
          let unusedFields = config.unused;
          publicVideos.forEach((video) => {
            unusedFields.forEach((field) => {
              delete video[field];
            });
          });
          resolve(publicVideos);
        }
      }
    );
  });
}

function isPublicAndPlayable(video) {
  if (video.privacy && video.is_playable) {
    if (video.privacy.view == "anybody") {
      return video;
    }
  }
}

export { GetVideos };
