import React from "react";
import Deafen from "./Deafen";
import Mute from "./Mute";
import "./Controls.css";
import { motion } from "framer-motion";
import SettingsButton from "./SettingsButton";
import { useSelector, useDispatch } from "react-redux";

import { CurrentMainContActions } from "../Store/store";

function Controls() {
  const currentMainCont = useSelector((state) => state.currentMainCont);
  let dispatch = useDispatch();

  return (
    <div className="ControlsMainCont">
      <div className="MediaControlsCont">
        <Mute />
        <Deafen />
      </div>
      <SettingsButton />
      <motion.i
        className={
          currentMainCont.value === "friendsCont"
            ? "ph-users-four-bold friendsTrigger activeCont"
            : "ph-users-four-bold friendsTrigger"
        }
        whileHover={{
          scale: 1.2,
          transition: {
            duration: 0.3,
            type: "spring",
          },
        }}
        onClick={() => {
          if (currentMainCont.value !== "friendsCont") {
            dispatch(
              CurrentMainContActions.changeCont({
                value: "friendsCont",
                id: "friendsCont",
                name: "friendsCont",
              })
            );
          }
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
    </div>
  );
}

export default Controls;
