import React from "react";
import { motion } from "framer-motion";

function ServerMessage_Channels(props) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      whileTap={{
        scale: 0.9,
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      className="ServerMessages_ChannelsCont-Channel"
    >
      <motion.i
        whileHover={{
          rotate: 180,
          transition: {
            duration: 1,
            type: "spring",
          },
        }}
        className={
          props.type === "text" ? "ph-chats-bold" : "ph-megaphone-bold"
        }
      ></motion.i>
      <p>Test Channel 1</p>
    </motion.div>
  );
}

export default ServerMessage_Channels;
