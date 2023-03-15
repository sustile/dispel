import React, { useState } from "react";
import "./Mute.css";

import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { ControlsActions } from "./../Store/store";

function Mute() {
  const Dispatch = useDispatch();
  const ControlsOptions = useSelector((state) => state.controls);

  function muteHandler() {
    Dispatch(ControlsActions.toggleMute());
  }

  return (
    <motion.i
      className={
        ControlsOptions.mute
          ? "ph-microphone-slash-bold muteToggle"
          : "ph-microphone-bold muteToggle"
      }
      onClick={muteHandler}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.5,
          type: "spring",
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
          type: "spring",
          damping: 25,
          stiffness: 500,
        },
      }}
    ></motion.i>
  );
}

export default Mute;
