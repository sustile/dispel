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
    <div className="Friends-Wrapper">
      <div className="Friends-type-Selector">
        <motion.button
          className={active === "all" ? "active" : ""}
          whileHover={
            active !== "all"
              ? {
                  scale: 1.12,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.12,
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
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          All
        </motion.button>
        <motion.button
          className={active === "online" ? "active" : ""}
          whileHover={
            active !== "online"
              ? {
                  scale: 1.12,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.12,
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
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          Online
        </motion.button>

        <motion.button
          className={active === "pending" ? "active" : ""}
          whileHover={
            active !== "pending"
              ? {
                  scale: 1.12,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.12,
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
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          Pending Requests
        </motion.button>

        <motion.button
          className={active === "addfriends" ? "active" : ""}
          whileHover={
            active !== "addfriends"
              ? {
                  scale: 1.12,
                  backgroundColor: "rgb(39, 39, 39)",
                  transition: {
                    type: "spring",
                    duration: 0.3,
                  },
                }
              : {
                  scale: 1.12,
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
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          Add Friends
        </motion.button>
      </div>
      {active === "online" && <OnlineFriends vcPeer={props.vcPeer} />}
      {active === "all" && <AllFriends socket={socket} vcPeer={props.vcPeer} />}
      {active === "pending" && <PendingRequests socket={socket} />}
      {active === "addfriends" && <AddFriends socket={socket} />}
    </div>
  );
}

export default Friends;
