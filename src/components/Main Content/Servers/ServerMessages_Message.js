import React from "react";
import { motion } from "framer-motion";

function ServerMessages_Message() {
  return (
    <motion.div
      className="ServerMessagesBody-Message"
      whileHover={{
        backgroundColor: "rgb(24, 24, 24)",
        transition: {
          duration: 0.3,
          type: "spring",
        },
      }}
    >
      <div className="ServerMessagesBody-Message_Details">
        <img src={require("./../../../test.gif")} />
        <h2>Systile</h2>
      </div>
      <div className="ServerMessagesBody-Message_Body">
        <p>Hello dawg</p>
      </div>
    </motion.div>
  );
}

export default ServerMessages_Message;
