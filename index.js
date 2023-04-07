const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(".env");
const app = express();
const userRouter = require("./routes/user");
const authentication = require("./middlewares/auth");
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/AuthCollection")
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("false");
  });

app.listen(process.env.PORT, (error) => {
  if (!error) return console.log("server true");
  return console.log(error);
});

app.use("", userRouter);

app.post("/welcome", authentication, (request, response) => {
  return response.status(200).send("welcome");
});
