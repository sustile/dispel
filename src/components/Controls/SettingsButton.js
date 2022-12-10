import React from "react";
import "./Settings.scss";
import { motion } from "framer-motion";

function SettingsButton() {
  return (
    <motion.i
      className="ph-gear-bold settingsTrigger"
      whileHover={{
        rotate: 180,
        transition: {
          duration: 1,
          type: "spring",
        },
      }}
      whileTap={{
        scale: 0.9,
        transition: {
          duration: 0.3,
          type: "spring",
          damping: 25,
          stiffness: 500,
        },
      }}
    ></motion.i>
  );
}

export default SettingsButton;
