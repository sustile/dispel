import React from "react";
import { motion } from "framer-motion";
import "./ServerMessages.css";

function ServerMessages_Header(props) {
  return (
    <div className="ServerMessages_MainHeader">
      <div className="ServerMessages_MainHeader_User">
        <h2>{props.name}</h2>
      </div>
      {/* <motion.i
        className="ph-phone-call-bold DirectMessagesCallToggle"
        whileHover={{
          scale: 1.2,
          transition: {
            duration: 0.5,
            type: "spring",
          },
        }}
        whileTap={{
          scale: 0.9,
          transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500,
          },
        }}
      ></motion.i> */}
    </div>
  );
}

export default ServerMessages_Header;
