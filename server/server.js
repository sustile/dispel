const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "./.env"),
});

mongoose.connect(process.env.DATABASE, () => {
  console.log("Connected to the Database");
});
