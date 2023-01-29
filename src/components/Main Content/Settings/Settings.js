import React, { useState } from "react";
import "./Settings.css";
import { motion } from "framer-motion";
import { act } from "react-dom/test-utils";
import SoundMenu from "./SoundMenu";
import AccountMenu from "./AccountMenu";

function Settings(props) {
  let socket = props.socket;

  let [active, setActive] = useState("account");
  return (
    <div className="Settings-Wrapper">
      <div className="Settings-type-Selector">
        <motion.button
          className={active === "account" ? "active" : ""}
          whileHover={
            active !== "account"
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
            if (active !== "account") setActive("account");
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          Account
        </motion.button>

        <motion.button
          className={active === "sound" ? "active" : ""}
          whileHover={
            active !== "sound"
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
            if (active !== "sound") setActive("sound");
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          Sound
        </motion.button>

        <motion.button
          className="logoutBtn"
          whileHover={{
            scale: 1.12,
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
          onClick={() => (window.location.href = "/logout")}
        >
          Logout
        </motion.button>
      </div>
      {active === "sound" && <SoundMenu />}
      {active === "account" && <AccountMenu />}
    </div>
  );
}

export default Settings;
