import React from "react";
import "./Settings.scss";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { CurrentMainContActions } from "../Store/store";

function SettingsButton(props) {
  let dispatch = useDispatch();
  const currentMainCont = useSelector((state) => state.currentMainCont);

  return (
    <motion.i
      className={
        currentMainCont.value === "settingsCont"
          ? "ph-gear-bold settingsTrigger activeCont"
          : "ph-gear-bold settingsTrigger"
      }
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
      onClick={() => {
        if (currentMainCont.value !== "settingsCont") {
          dispatch(
            CurrentMainContActions.changeCont({
              value: "settingsCont",
              id: "settingsCont",
              name: "settingsCont",
            })
          );
        }
      }}
    ></motion.i>
  );
}

export default SettingsButton;
