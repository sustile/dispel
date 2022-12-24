const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
const ExpressPeerServer = require("peer").ExpressPeerServer;
const { createServer } = require("http");
const io = require("./socketConnections");

const { verify } = require("./middlewares/middleware");
const router = require("./Routers/router");
const app = express();

// app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: 15000000 }));
app.use(express.static(path.join(__dirname, "../build")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/home", verify, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../build/index.html"));
});

app.get("/register", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../build/index.html"));
});

app.get("/login", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../build/index.html"));
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/login");
});

app.use("/", router);

// module.exports.io = require("socket.io")(5000, {
//   // cors: {
//   //   origin: ["http://localhost"],
//   // },
// });

const server = createServer(app);

const videoStreamServer = createServer(app);

videoStreamServer.listen(3004, () => {
  console.log("VideoStream Server Started on Port 3004");
});

app.use("/vcPeer", ExpressPeerServer(server, { debug: true }));
app.use(
  "/videoStreamPeer",
  ExpressPeerServer(videoStreamServer, { debug: true })
);

server.listen(4000, () => {
  console.log("Server Started on Port 4000");
});
