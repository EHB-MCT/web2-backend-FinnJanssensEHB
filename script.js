import "dotenv/config";
import express from "express";
import cors from "cors";

import * as mongo from "./mongo.js";
import * as v from "./vimeo.js";

const app = express();

app.use(cors());
// app.use(express.static("public"));
app.use(express.json());

app.get("/videos", async (req, res) => {
  let videos = await v.GetVideos();
  return res.json(videos);
});

app.post("/", (req, res) => {
  return res.send("Received a POST HTTP method");
});

app.put("/", (req, res) => {
  return res.send("Received a PUT HTTP method");
});

app.delete("/", (req, res) => {
  return res.send("Received a DELETE HTTP method");
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
