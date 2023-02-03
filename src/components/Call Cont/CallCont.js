import "./CallCont.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { AnimatePresence, motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { currentCallStatusAction } from "../Store/store";
import { current } from "@reduxjs/toolkit";

function CallCont(props) {
  let socket = props.socket;

  let USERDATA = useSelector((state) => state.USERDATA);
  let currentMainCont = useSelector((state) => state.currentMainCont);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);
  let CONSTANTS = useSelector((state) => state.CONSTANTS);
  let dispatch = useDispatch();
  let [activeCalldata, setActiveCallData] = useState({
    id: "",
    name: "",
    image: "",
    stream: null,
  });

  function clickHandler() {
    if (currentCallStatus.callObj) {
      currentCallStatus.callObj.close();
    }

    socket.emit("end-call", currentCallStatus.currentCallCont);
    dispatch(currentCallStatusAction.closeCall());
  }

  useEffect(() => {
    if (currentCallStatus.status) {
      let x = currentCallStatus.callList.filter(
        (el) => el.id !== USERDATA.id
      )[0];
      setActiveCallData(x);
    }
  }, [currentCallStatus]);

  return (
    <motion.div
      className="Call-Container"
      initial={{ translateY: -200 }}
      animate={{
        translateY: 0,
        transition: {
          duration: "1.3",
          type: "spring",
          damping: 25,
          stiffness: 500,
        },
      }}
      exit={{ translateY: -200 }}
    >
      <div className="Call_details">
        <span className="activeCallText">
          {!currentCallStatus.waiting.status &&
            `In Active Call with ${activeCalldata.name}`}
          {currentCallStatus.waiting.status &&
            `Waiting for Connection from ${currentCallStatus.waiting.name}`}
        </span>
        {/* <span className="activeCallText">Waiting in the Lobby</span> */}
        {currentCallStatus.status && (
          <div className="Call_details-User">
            <img src={`/Images/${activeCalldata.image}`} />
            <span>{activeCalldata.name}</span>
          </div>
        )}
        {/* <div className="Call_details-User">
          <img src={`/Images/default.png`} />
          <span>Systile</span>
        </div> */}

        {currentCallStatus.waiting.status && (
          <lord-icon
            src="https://cdn.lordicon.com/kvsszuvz.json"
            trigger="loop"
            colors="primary:#9f85ff,secondary:#08a88a"
            style={{ scale: "2.2", marginLeft: "1rem" }}
          ></lord-icon>
        )}
      </div>
      {(currentCallStatus.status || currentCallStatus.waiting.status) && (
        <motion.button
          className="DirectMessagesCallLeave"
          onClick={clickHandler}
          whileHover={
            !currentCallStatus.status
              ? {
                  scale: 1.2,
                  transition: {
                    duration: 0.5,
                    type: "spring",
                  },
                }
              : ""
          }
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              type: "spring",
              damping: 25,
              stiffness: 500,
            },
          }}
        >
          <motion.i className="ph-phone-slash-bold "></motion.i>
        </motion.button>
      )}
    </motion.div>
  );
}

export default CallCont;
