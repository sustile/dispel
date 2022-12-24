const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const message = mongoose.model("message", messageModel);
module.exports.message = message;

// const changeStream = message.watch([]);
// changeStream.on("change", (next) => {
//   console.log(next);
// });

exports.saveMessage = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    if (!body) {
      res.status(400).json({
        status: "fail",
        message: "No Values Provided",
      });
      return;
    }

    const x = new mongoose.Types.ObjectId().toHexString();

    if (user.dms.includes(body.dmId)) {
      await message.create(
        Object.assign(
          {
            _id: x,
            userId: user._id,
            name: user.name,
          },
          req.body
        )
      );

      const messageObj = await message.findOne({ _id: x });

      res.status(200).json({
        status: "ok",
        obj: messageObj,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "User Doesn't Have Access to this DM",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    if (!body) {
      res.status(400).json({
        status: "fail",
        message: "No Values Provided",
      });
      return;
    }

    if (user.dms.includes(body.dmId)) {
      const check = await message.findOne({
        _id: body.messageId,
        dmId: body.dmId,
      });

      if (!check) {
        res.status(400).json({
          status: "fail",
          message: "User Doesn't Have Access to this Message",
        });
      } else {
        await message.findByIdAndUpdate(
          {
            _id: body.messageId,
          },
          {
            message: body.message,
          }
        );

        const messageObj = await message.findOne({ _id: body.messageId });

        res.status(200).json({
          status: "ok",
          obj: messageObj,
        });
      }
    } else {
      res.status(400).json({
        status: "fail",
        message: "User Doesn't Have Access to this DM",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

exports.lazyLoadMessages = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    if (!body) {
      res.status(400).json({
        status: "fail",
        message: "No Data Provided",
      });
      return;
    }

    const limit = 10;
    const page = (body.page - 1) * limit;

    const result = await message
      .find({ dmId: body.dmId })
      .sort({ createdAt: -1 })
      .skip(page)
      .limit(limit);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

exports.getMessageData = async (req, res) => {
  try {
    const body = req.body;

    if (!body) {
      res.status(400).json({
        status: "fail",
        message: "No Data Provided",
      });
      return;
    }

    const result = await message.find({ _id: body.id });
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};
