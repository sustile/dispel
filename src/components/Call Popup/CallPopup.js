import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./CallPopup.css";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { currentCallStatusAction } from "../Store/store";

function CallPopup(props) {
  let vcPeer = props.vcPeer;
  let socket = props.socket;
  let [displayPopup, setDisplayPopup] = useState(false);
  let [displayData, setDisplayData] = useState({
    name: "",
    image: "",
    room: "",
  });
  let [initial, setInital] = useState(false);
  let dispatch = useDispatch();

  let currentMainCont = useSelector((state) => state.currentMainCont);
  let USERDATA = useSelector((state) => state.USERDATA);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);

  let currentMainContRef = useRef();
  let currentCallStatusRef = useRef();
  let USERDATAref = useRef();

  useEffect(() => {
    currentMainContRef.current = currentMainCont;
    currentCallStatusRef.current = currentCallStatus;
    USERDATAref.current = USERDATA;
  }, [currentCallStatus, currentMainCont, USERDATA]);

  function attendHandler() {
    socket.emit("joined-call", {
      room: displayData.room || currentMainCont.id,
      id: USERDATA.id,
      name: USERDATA.name,
      image: USERDATA.image,
    });
    dispatch(
      currentCallStatusAction.setCont(displayData.room || currentMainCont.id)
    );
    setDisplayPopup(false);
    setDisplayData({
      name: "",
      image: "",
      room: "",
    });
  }

  function declineHandler() {
    setDisplayPopup(false);
    setDisplayData({
      name: "",
      image: "",
      room: "",
    });
  }

  useEffect(() => {
    if (!initial) {
      socket.on("incoming-call", (data) => {
        if (data.room === currentCallStatusRef.current.waiting.room) {
          socket.emit("joined-call", {
            room: currentCallStatusRef.current.waiting.room,
            id: USERDATAref.current.id,
            name: USERDATAref.current.name,
            image: USERDATAref.current.image,
          });
          return;
        } else {
          setDisplayData({
            name: data.name,
            room: data.room,
            image: data.image,
          });
          setDisplayPopup(true);
        }
        setInital(true);
      });
    }
  }, [initial]);

  useEffect(() => {
    if (displayPopup) {
      let timer = setTimeout(() => {
        setDisplayPopup(false);
        setDisplayData({
          name: "",
          image: "",
          room: "",
        });
      }, 10 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [displayPopup]);

  return (
    <AnimatePresence initial={false} exitBeforeEnter={true}>
      {displayPopup && (
        <motion.div className="CallPopup">
          <motion.div
            className="Modal"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
                type: "spring",
                damping: 25,
                stiffness: 500,
              },
            }}
            exit={{ opacity: 0 }}
          ></motion.div>
          <motion.div
            className="PopupCont"
            initial={{
              transform: "translate(-50%, -50%) scale(0)",
              opacity: 0,
            }}
            animate={{
              transform: "translate(-50%, -50%) scale(1)",
              opacity: 1,
              transition: {
                duration: 0.5,
                type: "spring",
                damping: 25,
                stiffness: 500,
              },
            }}
            exit={{ transform: "translate(-50%, -50%) scale(0.7)", opacity: 0 }}
          >
            <h2>Incoming Call</h2>
            <div className="call_details">
              <img src={`/Images/${displayData.image}`} />
              <span>{displayData.name}</span>
            </div>
            <div className="callControls">
              {!currentCallStatus.status && (
                <motion.button
                  className="callAttend"
                  onClick={attendHandler}
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
                      duration: 0.1,
                      type: "spring",
                      damping: 25,
                      stiffness: 500,
                    },
                  }}
                >
                  <motion.i className="ph-check-bold "></motion.i>
                </motion.button>
              )}
              <motion.button
                className="callReject"
                onClick={declineHandler}
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
                    duration: 0.1,
                    type: "spring",
                    damping: 25,
                    stiffness: 500,
                  },
                }}
              >
                <motion.i className="ph-x-bold "></motion.i>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CallPopup;
