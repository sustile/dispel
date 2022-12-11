import React from "react";
import { motion } from "framer-motion";

function OnlineFriends(props) {
  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>Online</h2>
      </div>
      <div className="Friends-MasterCont_RenderCont">
        <Friends_User />
      </div>
    </div>
  );
}

function Friends_User() {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgb(31, 31, 31)",
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      className="Friends-MasterCont_RenderCont-friend"
    >
      <div className="detailsCont">
        <img src={`/Images/test.gif`} />
        <div className="userDetails">
          <span>Systile</span>
          <p>234328473284723</p>
        </div>
      </div>
      <motion.i
        className="ph-chats-bold"
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
      ></motion.i>
    </motion.div>
  );
}

export default OnlineFriends;
