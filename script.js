import 'dotenv/config';
import express from 'express';
import * as mongo from './mongo.js'

const app = express();

app.get('/videos', async (req, res) => {
  await mongo.connectToClient();
  const videos = await mongo.getCollection('Videos');
  mongo.closeClient();
  return res.send(videos);
});

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);