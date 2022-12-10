const io = require("socket.io")(5000, {
  // cors: {
  //   origin: ["http://localhost"],
  // },
});

module.exports = io;

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("send-message_dm", (data) => {
    socket.to(data.room).emit("receive-message_dm", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("joined-call", (data) => {
    socket.to(data.room).emit("joined-call", data);
  });

  socket.on("incoming-call", (data) => {
    socket.to(data.room).emit("incoming-call", data);
  });

  socket.on("getCallData", (room) => {
    console.log(room);
    socket.to(room).emit("getCallData", room);
  });

  socket.on("end-call", (room) => {
    socket.to(room).emit("end-call", room);
  });

  socket.on("receiveCallData", (data) => {
    socket.to(data.room).emit("receiveCallData", data);
  });
});
