import React from "react";
import "./Friends.css";
import { motion } from "framer-motion";
import { useState } from "react";
import OnlineFriends from "./OnlineFriends";
import AllFriends from "./AllFriends";
import PendingRequests from "./PendingRequests";
import AddFriends from "./AddFriends";

function Friends(props) {
  let socket = props.socket;

  let [active, setActive] = useState("all");

  return (
    <motion.div
      className="Friends-Wrapper"
      // initial={{ scale: 0.98, opacity: 0 }}
      // animate={{
      //   scale: 1,
      //   opacity: 1,
      //   transition: {
      //     duration: 0.2,
      //   },
      // }}
      // exit={{
      //   scale: 0.6,
      //   opacity: 0,
      //   transition: {
      //     duration: 0.2,
      //   },
      // }}
    >
      <div className="Friends-type-Selector">
        <motion.button
          className={active === "all" ? "active" : ""}
          whileHover={
            active !== "all"
              ? {
                  scale: 1.03,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.03,
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
          }
          onClick={() => {
            if (active !== "all") setActive("all");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-users-four"></i>
          All
        </motion.button>
        <motion.button
          className={active === "online" ? "active" : ""}
          whileHover={
            active !== "online"
              ? {
                  scale: 1.03,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.03,
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
          }
          onClick={() => {
            if (active !== "online") setActive("online");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-globe-simple"></i>
          Online
        </motion.button>

        <motion.button
          className={active === "pending" ? "active" : ""}
          whileHover={
            active !== "pending"
              ? {
                  scale: 1.03,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.03,
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
          }
          onClick={() => {
            if (active !== "pending") setActive("pending");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-hourglass-medium"></i>
          Pending
        </motion.button>

        <motion.button
          className={active === "addfriends" ? "active" : ""}
          whileHover={
            active !== "addfriends"
              ? {
                  scale: 1.03,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.03,
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
          }
          onClick={() => {
            if (active !== "addfriends") setActive("addfriends");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-user-plus"></i>
          Add
        </motion.button>
      </div>
      {active === "online" && (
        <OnlineFriends vcPeer={props.vcPeer} socket={socket} />
      )}
      {active === "all" && <AllFriends socket={socket} vcPeer={props.vcPeer} />}
      {active === "pending" && <PendingRequests socket={socket} />}
      {active === "addfriends" && <AddFriends socket={socket} />}
    </motion.div>
  );
}

export default Friends;
