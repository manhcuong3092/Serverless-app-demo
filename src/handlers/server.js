const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

app.get("/user", (req, res) => {
  console.log(req);
  res.send("User!");
});

app.post("/", (req, res) => {
  console.log(req);
  res.send("Post success!");
});

exports.handler = serverless(app);
