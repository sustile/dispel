import React from "react";
// import ReactDOM from "react-dom";
import "./Backdrop.css";
import { AnimatePresence, motion } from "framer-motion";

function Backdrop(props) {
  return (
    <React.Fragment>
      <motion.div
        onClick={props.closeModal}
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
        className="BackdropModal"
      ></motion.div>
      <motion.div
        initial={{ translateX: -500 }}
        animate={{
          translateX: 0,
          transition: {
            type: "spring",
            duration: "0.7",
          },
        }}
        exit={{
          translateX: -500,
        }}
        className="ModalContent"
      >
        {props.children}
      </motion.div>
    </React.Fragment>
  );
}
export default Backdrop;
