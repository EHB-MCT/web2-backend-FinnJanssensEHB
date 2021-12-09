import "dotenv/config";
import express from "express";
import cors from "cors";

import * as mongo from "./mongo.js";

const app = express();

app.use(cors());
// app.use(express.static("public"));
app.use(express.json());

app.get("/videos", async (req, res) => {
  console.log("test");
  await mongo.connectToClient();
  await mongo.updateVideosCollection();
  const videos = await mongo.getCollection("Videos");
  mongo.closeClient();
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
