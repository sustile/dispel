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
    <motion.div
      className="Settings-Wrapper"
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
      <div className="Settings-type-Selector">
        <motion.button
          className={active === "account" ? "active" : ""}
          whileHover={
            active !== "account"
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
            if (active !== "account") setActive("account");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-user"></i>
          Account
        </motion.button>

        <motion.button
          className={active === "sound" ? "active" : ""}
          whileHover={
            active !== "sound"
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
            if (active !== "sound") setActive("sound");
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
        >
          <i class="ph ph-speaker-simple-high"></i>
          Sound
        </motion.button>

        <motion.button
          className="logoutBtn"
          whileHover={{
            scale: 1.03,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
          whileTap={{
            scale: 0.98,
            transition: {
              type: "spring",
              duration: 0.3,
            },
          }}
          onClick={() => (window.location.href = "/logout")}
        >
          <i class="ph ph-sign-out"></i>
          Logout
        </motion.button>
      </div>
      {active === "sound" && <SoundMenu />}
      {active === "account" && <AccountMenu />}
    </motion.div>
  );
}

export default Settings;
