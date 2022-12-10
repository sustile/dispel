import React, { useState } from "react";
import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { CurrentMainContActions } from "./../../Store/store";

function Sidebar_Servers_server(props) {
  const Dispatch = useDispatch();
  const CurrentMain = useSelector((state) => state.currentMainCont);

  function ClickHandler(e) {
    e.preventDefault();
    if (CurrentMain.value !== "serverCont") {
      Dispatch(
        CurrentMainContActions.changeCont({
          value: "serverCont",
          id: props.data.serverId,
          name: props.data.name,
        })
      );
      props.closeSidebar();
    } else if (
      CurrentMain.value === "serverCont" &&
      CurrentMain.id !== props.data.serverId
    ) {
      Dispatch(
        CurrentMainContActions.changeCont({
          value: "serverCont",
          id: props.data.serverId,
          name: props.data.name,
        })
      );
      props.closeSidebar();
    }
  }

  return (
    <motion.div className="Servers_Sidebar_MainCont_Server">
      <motion.img
        whileHover={{
          scale: 1.2,
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
        src={`/Images/${props.data.image}`}
        alt=""
      />
    </motion.div>
  );
}

export default Sidebar_Servers_server;
