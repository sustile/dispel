import React, { useState } from "react";
import "./Deafen.css";
import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { ControlsActions } from "./../Store/store";

function Deafen() {
  const Dispatcher = useDispatch();
  const ControlsOptions = useSelector((state) => state.controls);

  const deafenHandler = () => {
    Dispatcher(ControlsActions.toggleDeafen());
  };

  return (
    <motion.i
      className={
        ControlsOptions.deafen
          ? "ph-speaker-simple-slash-bold deafenToggle"
          : "ph-speaker-simple-high-bold deafenToggle"
      }
      onClick={deafenHandler}
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
          duration: 0.3,
          type: "spring",
          damping: 25,
          stiffness: 500,
        },
      }}
    ></motion.i>
  );
}

export default Deafen;
