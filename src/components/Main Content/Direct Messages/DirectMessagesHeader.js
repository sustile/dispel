import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function DirectMessagesHeader(props) {
  let VOICESTREAM = props.VOICESTREAM;
  let socket = props.socket;
  let vcPeer = props.vcPeer;

  let USERDATA = useSelector((state) => state.USERDATA);
  let currentMainCont = useSelector((state) => state.currentMainCont);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);
  let call;

  function clickHandler() {
    // socket.emit("joined-call", {
    //   room: currentMainCont.id,
    //   id: USERDATA.id,
    //   name: USERDATA.name,
    //   image: USERDATA.image,
    // });
    socket.emit("incoming-call", {
      room: currentMainCont.id,
      id: USERDATA.id,
      name: USERDATA.name,
      image: USERDATA.image,
    });
  }

  return (
    <div className="DirectMessagesHeader">
      <div className="DirectMessagesHeader_User">
        <h2>{props.name}</h2>
      </div>
      <motion.button
        className="DirectMessagesCallToggle"
        onClick={clickHandler}
        disabled={currentCallStatus.status}
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
        <motion.i className="ph-phone-call-bold "></motion.i>
      </motion.button>
    </div>
  );
}

export default DirectMessagesHeader;
