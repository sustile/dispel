import React, { useState } from "react";
import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { CurrentMainContActions } from "./../../Store/store";

function Sidebar_DirectMessages_User(props) {
  const Dispatch = useDispatch();
  const CurrentMain = useSelector((state) => state.currentMainCont);

  function ClickHandler(e) {
    e.preventDefault();
    if (CurrentMain.value !== "dmCont") {
      Dispatch(
        CurrentMainContActions.changeCont({
          value: "dmCont",
          id: props.data.dmId,
          name: props.data.to,
        })
      );
      props.closeSidebar();
    } else if (
      CurrentMain.value === "dmCont" &&
      CurrentMain.id !== props.data.dmId
    ) {
      Dispatch(
        CurrentMainContActions.changeCont({
          value: "dmCont",
          id: props.data.dmId,
          name: props.data.to,
        })
      );
      props.closeSidebar();
    }
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        backgroundColor: "rgb(39, 39, 39)",
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      onClick={ClickHandler}
      whileTap={{
        scale: 0.9,
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      className="DirectMessages_Sidebar_Main_DM"
    >
      <img src={`/Images/${props.data.image}`} alt="" />
      <p>{props.data.to}</p>
    </motion.div>
  );
}

export default Sidebar_DirectMessages_User;
