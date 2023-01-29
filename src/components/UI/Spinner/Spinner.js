import React from "react";
import "./Spinner.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { spinnerActions } from "./../../Store/store";

function Spinner() {
  const spinnerState = useSelector((state) => state.spinner);
  return (
    <AnimatePresence initial={false} exitBeforeEnter={true}>
      {spinnerState && (
        <motion.div
          className="Spinner"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.3,
            },
          }}
          exit={{ opacity: 0 }}
        >
          <div className="container">
            <svg viewBox="0 0 100 100">
              <defs>
                <filter id="shadow">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="2"
                    floodColor="var(--secondary-red)"
                  />
                </filter>
              </defs>
              <motion.circle
                id="spinner"
                cx="50"
                cy="50"
                r="45"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.3,
                    type: "spring",
                  },
                }}
                exit={{ opacity: 0, scale: 0 }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Spinner;
