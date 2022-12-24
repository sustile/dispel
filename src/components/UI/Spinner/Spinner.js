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
        <div className="Spinner">
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
              <circle id="spinner" cx="50" cy="50" r="45" />
            </svg>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Spinner;
