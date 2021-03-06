import "dotenv/config";
import express from "express";
import cors from "cors";
import pkg from "express-openid-connect";
import path from "path";

const { auth, requiresAuth } = pkg;

import * as mongo from "./scripts/mongo.js";
import * as v from "./scripts/vimeo.js";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
};

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(auth(config));

app.get("/", (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.redirect("/admin");
  }
});

app.get("/unauthorized", (req, res) => {
  res.send("Faulty login");
});

app.use("/admin", requiresAuth());
app.use("/admin", express.static(path.join(path.resolve(), "admin")));

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get("/videos", async (req, res) => {
  let videos = await v.GetVideos();
  return res.json(videos);
});

app.get("/videos/:uri", async (req, res) => {
  let { uri } = req.params;
  let link = `/videos/${uri}`;
  console.log(link);
  let videos = await v.GetVideos();
  let result = [...videos].filter(function (video) {
    return video.uri == link;
  });
  if (result[0]) {
    return res.json(result[0]);
  } else {
    return res.status(400).send("That video uri was not found.");
  }
});

app.get("/featured", async (req, res) => {
  await mongo.connectToClient();
  let featured = await mongo.getCollection("Featured");
  mongo.closeClient();
  return res.json(featured);
});

app.post("/featured/:uri", requiresAuth(), async (req, res) => {
  let { uri } = req.params;
  let link = `https://vimeo.com/${uri}`;
  await mongo.connectToClient();
  let id = await mongo.isVideoFeatured(link);
  if (id != null) {
    console.log(id);
    await mongo.deleteDocument(id, "Featured");
  } else {
    console.log("video isnt featured yet");
    await mongo.insertDocument({ link: link }, "Featured");
  }
  mongo.closeClient();
  return res.status(200).send();
});

app.get("/featured/:uri", async (req, res) => {
  let { uri } = req.params;
  let link = `https://vimeo.com/${uri}`;
  await mongo.connectToClient();
  let id = await mongo.isVideoFeatured(link);
  if (id != null) {
    res.redirect(`/videos/${uri}`);
  } else {
    res.status(404).send("This video isn't featured");
  }
  mongo.closeClient();
});

app.get("/programmas", async (req, res) => {
  await mongo.connectToClient();
  let programmas = await mongo.getCollection("Programmas");
  mongo.closeClient();
  return res.json(programmas);
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
