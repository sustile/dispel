import React from "react";
import { motion } from "framer-motion";

function DirectMessages_Message(props) {
  let date = new Date(props.data.createdAt);
  let monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let dateString = `${String(date.getDate()).padStart(2, "0")} ${
    monthList[date.getMonth()]
  } ${date.getFullYear()}, ${
    date.getHours() > 12
      ? String(date.getHours() - 12).padStart(2, "0")
      : String(date.getHours()).padStart(2, "0")
  }:${String(date.getMinutes()).padStart(2, "0")} ${
    date.getHours() > 12 ? "PM" : "AM"
  }`;

  return (
    <motion.div
      className="DirectMessagesBody-Message"
      whileHover={{
        backgroundColor: "rgb(24, 24, 24)",
        transition: {
          duration: 0.3,
          type: "spring",
        },
      }}
    >
      <div className="DirectMessagesBody-Message_Details">
        <img src={`/Images/${props.data.image}`} />
        <h2>{props.data.name}</h2>
        <span>{dateString}</span>
      </div>
      <div className="DirectMessagesBody-Message_Body">
        <p>{props.data.message}</p>
      </div>
    </motion.div>
  );
}

export default DirectMessages_Message;
