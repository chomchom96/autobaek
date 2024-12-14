const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const mongodbURI = process.env.MONGODB_URI;
const userRouter = require("./routes/user");
const problemRouter = require("./routes/problem");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use(userRouter);
app.use(problemRouter);

app.use((error, req, res, next) => {
  // console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(mongodbURI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
