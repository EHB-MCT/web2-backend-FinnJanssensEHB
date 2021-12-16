import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import * as mongo from "./mongo.js";
import * as v from "./vimeo.js";

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/admin");
});

// app.use("/admin", requiresAuth());
app.use("/admin", express.static(path.join(path.resolve(), "admin")));

app.get("/videos", async (req, res) => {
  let videos = await v.GetVideos();
  return res.json(videos);
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
