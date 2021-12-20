"use strict";

import "dotenv/config";
import * as mdb from "mongodb";
import * as v from "./vimeo.js";

const mongo_uri = process.env.MONGO_URI;
const mongoClient = new mdb.MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = "Airbox";

async function connectToClient() {
  await mongoClient.connect();
  console.log("Connected successfully to server");
}

function closeClient() {
  mongoClient.close();
}

async function getCollection(collectionName) {
  const db = mongoClient.db(dbName);
  const collection = db.collection(collectionName);
  const findResult = await collection.find({}).toArray();
  // console.log("Found documents =>", findResult);
  return findResult;
}

async function insertVideos(videos) {
  const db = mongoClient.db(dbName);
  const collection = db.collection("Videos");
  const insertResult = await collection.insertMany(documents);
  console.log("Inserted documents =>", insertResult);
  return "done";
}

async function updateVideosCollection() {
  return await v.GetVideos();
}

export {
  connectToClient,
  closeClient,
  getCollection,
  insertVideos,
  updateVideosCollection,
};
