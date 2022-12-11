import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContextMenuActions } from "../../Store/store";

import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import generateUniqueId from "generate-unique-id";
import axios from "axios";
import { dmMessagesAction } from "../../Store/store";

function DirectMessages_Message(props) {
  let date = new Date(props.data.createdAt);
  let message = props.data.message;
  let monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let dateString = `${String(date.getDate()).padStart(2, "0")} ${
    monthList[date.getMonth()]
  } ${date.getFullYear()}, ${
    date.getHours() > 12
      ? String(date.getHours() - 12).padStart(2, "0")
      : String(date.getHours()).padStart(2, "0")
  }:${String(date.getMinutes()).padStart(2, "0")} ${
    date.getHours() > 12 ? "PM" : "AM"
  }`;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [Id, setId] = useState(generateUniqueId());
  let ContextMenu = useSelector((state) => state.contextMenu);

  let messageRef = useRef();

  let dispatch = useDispatch();

  function contextMenuHandler(e) {
    e.preventDefault();

    e.pageX + 150 > window.innerWidth
      ? setX(`${window.innerWidth - 180}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 200 > window.innerHeight
      ? setY(`${window.innerHeight - 220}px`)
      : setY(`${e.pageY}px`);

    dispatch(ContextMenuActions.loadMenu(Id));
  }

  useEffect(() => {
    messageRef.current.addEventListener("contextmenu", contextMenuHandler);

    // return () => {
    //   messageRef.current.removeEventListener("contextmenu", contextMenuHandler);
    // };
  });

  // EDIT MESSAGE
  let editInput = useRef();
  let [editInputVal, setEditInputVal] = useState(props.data.message);
  let [isEdit, setIsEdit] = useState(false);
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const currentMainCont = useSelector((state) => state.currentMainCont);
  const USERDATA = useSelector((state) => state.USERDATA);

  async function editFormHandler(e) {
    e.preventDefault();
    if (editInputVal.trim() === "" && editInputVal.trim() === message) {
      setEditInputVal(message);
      setIsEdit(false);
      return;
    }
    let data = await axios.post(`${CONSTANTS.ip}/api/editMessage`, {
      messageId: props.data.objId,
      dmId: currentMainCont.id,
      message: editInputVal.trim(),
      type: "normal",
    });
    if (data.data.status === "ok") {
      message = editInputVal.trim();
      data = data.data.obj;
      dispatch(
        dmMessagesAction.updateMessage({
          objId: data._id,
          dmId: data.dmId,
          message: data.message,
          from: data.userId,
          name: data.name,
          image: USERDATA.image,
          createdAt: data.createdAt,
        })
      );
    }

    setEditInputVal(message);
    setIsEdit(false);
  }

  return (
    <motion.div
      className="DirectMessagesBody-Message"
      ref={messageRef}
      whileHover={{
        backgroundColor: "rgb(24, 24, 24)",
        transition: {
          duration: 0.3,
          type: "spring",
        },
      }}
    >
      <div className="DirectMessagesBody-Message_Details">
        <img src={`/Images/${props.data.image}`} />
        <h2>{props.data.name}</h2>
        <span>{dateString}</span>
      </div>
      <div className="DirectMessagesBody-Message_Body">
        {isEdit || <p>{message}</p>}
        <AnimatePresence initial={false} exitBeforeEnter={true}>
          {isEdit && (
            <motion.form
              className="MessageEditForm"
              onSubmit={editFormHandler}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.2,
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.1,
                },
              }}
            >
              <input
                ref={editInput}
                onChange={(e) => setEditInputVal(e.target.value)}
                type="text"
                value={editInputVal}
                placeholder="Enter The new Message"
                maxLength="200"
                minLength="1"
                className="editMessageInput"
              />
              <motion.div className="BtnsCont">
                <motion.button
                  type="Submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Submit
                </motion.button>
                <motion.button
                  type="button"
                  className="EditCancel"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditInputVal(message);
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {ContextMenu.id === Id && (
          <motion.div
            className="DirectMessages_MessageContextMenu"
            style={{
              top: y,
              left: x,
            }}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
          >
            <motion.div
              className="ContextMenuOption"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEdit(true)}
            >
              <i class="ph-pen-bold"></i>
              <span>Edit Message</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DirectMessages_Message;
