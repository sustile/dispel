import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import "./Notifications.css";
import { notificationsAction } from "../../Store/store";

export default function Notifications() {
  let dispatch = useDispatch();
  let notificationState = useSelector((state) => state.notifications);
  useEffect(() => {
    if (!notificationState.ongoing) return;
    let timer = setTimeout(() => {
      if (notificationState.ongoing) {
        dispatch(notificationsAction.closeNotifications());
      }
    }, 5 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [notificationState]);
  return (
    <AnimatePresence initial={false} mode="wait">
      {notificationState.ongoing && (
        <motion.div
          initial={{ top: "-10rem" }}
          animate={{
            top: "2rem",
            transition: {
              duration: 0.4,
              type: "spring",
            },
          }}
          exit={{
            top: "-10rem",
            transition: {
              duration: 0.3,
              type: "spring",
            },
          }}
          className="Notifications"
        >
          <div className="data-cont">
            <i
              class={
                notificationState.type === "error"
                  ? "ph-circle-wavy-warning"
                  : "ph-thumbs-up"
              }
            ></i>
            <p>{notificationState.message}</p>
          </div>
          <motion.i
            whileHover={{
              scale: 1.3,
              transition: {
                duration: 0.3,
                type: "spring",
              },
            }}
            whileTap={{
              scale: 1,
              transition: {
                duration: 0.3,
                type: "spring",
              },
            }}
            class="ph-x closeNotis"
            onClick={() => dispatch(notificationsAction.closeNotifications())}
          ></motion.i>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
