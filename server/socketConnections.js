const { message } = require("./controllers/messageController");
const { account } = require("./controllers/accountController");
const mongoose = require("mongoose");

const io = require("socket.io")(5000, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: ["http://localhost:4000"],
  },
});

module.exports = io;

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("send-message_dm", (data) => {
    if (data.type.includes("image")) {
    }
    socket.to(data.room).emit("receive-message_dm", data);
  });

  socket.on("edit_message-dm", (room, data) => {
    socket.to(room).emit("edit_message-dm", data);
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
    socket.to(room).emit("getCallData", room);
  });

  socket.on("end-call", (room) => {
    socket.to(room).emit("end-call", room);
  });

  socket.on("receiveCallData", (data) => {
    socket.to(data.room).emit("receiveCallData", data);
  });

  socket.on("save-dm-message", (id, fileData, data, socketId) => {
    console.log(socketId);
    saveMessages(id, data, socket, fileData, socketId, io);
  });

  // socket.on("image", (image) => {
  //   console.log("yes");
  //   const buffer = Buffer.from(image, "base64");

  //   console.log(buffer);
  // });
});

async function saveMessages(userId, data, socket, otherData, socketId, io) {
  if (!data) {
    socket.to(socketId).emit("save-dm-message", {
      status: "FAIL",
    });
  }

  const user = await account.findOne({ _id: userId });
  if (!user) {
    io.to(socketId).emit("save-dm-message", {
      status: "FAIL",
    });
  }

  const x = new mongoose.Types.ObjectId().toHexString();
  if (user.dms.includes(data.dmId)) {
    let y = await message.create(
      Object.assign(
        {
          _id: x,
          userId: user._id,
          name: user.name,
        },
        data
      )
    );

    const messageObj = await message.findOne({ _id: x });
    io.to(socketId).emit("save-dm-message", {
      status: "OK",
      data: messageObj,
      ...otherData,
    });
  } else {
    io.to(socketId).emit("save-dm-message", {
      status: "FAIL",
    });
  }
}
