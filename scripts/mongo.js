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

async function insertDocument(data, collectionName) {
  const db = mongoClient.db(dbName);
  const collection = db.collection(collectionName);
  await collection.insertOne(data);
}

async function deleteDocument(id, collectionName) {
  const db = mongoClient.db(dbName);
  const collection = db.collection(collectionName);
  await collection.deleteOne({
    _id: mdb.ObjectId(id),
  });
}

async function isVideoFeatured(link) {
  const db = mongoClient.db(dbName);
  const collection = db.collection("Featured");
  const searchResult = await collection.find({ link: link }).toArray();
  if (searchResult.length == 0) {
    return null;
  } else {
    let oID = searchResult[0]._id;
    return String(oID);
  }
}

export {
  connectToClient,
  closeClient,
  getCollection,
  insertDocument,
  deleteDocument,
  isVideoFeatured,
};
