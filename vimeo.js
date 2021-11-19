"use strict";

import 'dotenv/config';
import * as v from 'vimeo';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const access_token = process.env.ACCESS_TOKEN;

let client = new v.Vimeo(client_id, client_secret, access_token);

let file_name = "test.m4v"
client.upload(
  file_name, {
    'name': 'Test upload',
    'description': 'This is a test of the Vimeo API'
  },
  function (uri) {
    console.log('Your video URI is: ' + uri);
  },
  function (bytes_uploaded, bytes_total) {
    var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
    console.log(bytes_uploaded, bytes_total, percentage + '%')
  },
  function (error) {
    console.log('Failed because: ' + error)
  }
)