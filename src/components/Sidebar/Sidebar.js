import React, { useState } from "react";
import Sidebar_DirectMessages from "./Direct Messages/Sidebar_DirectMessages";
import Sidebar_Servers from "./Servers/Sidebar_Servers";
import Backdrop from "../UI/SidebarBackdrop/Backdrop";
import "./Sidebar.css";
import { AnimatePresence, motion } from "framer-motion";

function Sidebar() {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  function closeSidebar() {
    setSidebarOpen((prev) => false);
  }

  return (
    <div className="Sidebar">
      <motion.i
        className="ph-chat-teardrop-text-bold Sidebar_ToggleBtn"
        onClick={toggleSidebar}
        whileHover={{
          scale: 1.3,
          transition: {
            duration: 0.5,
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
      ></motion.i>

      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {sidebarIsOpen && (
          <motion.i
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.5,
                type: "spring",
              },
            }}
            whileHover={{
              scale: 1.3,
              transition: {
                duration: 0.5,
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
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={toggleSidebar}
            className="ph-x-bold Sidebar_CloseBtn"
          ></motion.i>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {sidebarIsOpen && (
          <Backdrop closeModal={toggleSidebar}>
            <Sidebar_DirectMessages closeSidebar={closeSidebar} />
            <Sidebar_Servers closeSidebar={closeSidebar} />
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Sidebar;
