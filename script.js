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

app.get("/videos", requiresAuth(), async (req, res) => {
  let videos = await v.GetVideos();
  return res.json(videos);
});

app.get("/featured", async (req, res) => {
  await mongo.connectToClient();
  let featured = await mongo.getCollection("Featured");
  mongo.closeClient();
  return res.json(featured);
});

app.post("/featured/:uri", async (req, res) => {
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

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
