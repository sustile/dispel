import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContextMenuActions } from "../../Store/store";

import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import generateUniqueId from "generate-unique-id";
import axios from "axios";
import { dmMessagesAction } from "../../Store/store";
import urlRegex from "url-regex";
import { Buffer } from "buffer";
import parse from "html-react-parser";

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match) => {
    const promise = asyncFn(match);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, (user) => {
    if (data[0].status === "ok") {
      return `<span className="userPing">@${data[0].name}</span>`;
    }
    data.shift();
    return user;
  });

  // if (data.status === "ok") {
  //   return `<span className="userPing">${data.name}</span>`;
  // }
  // return `<span className="userPing">${user}</span>`;
}

function DirectMessages_Message(props) {
  let date = new Date(props.data.createdAt);
  let setReply = props.setReply;
  let [linkthere, setLinkThere] = useState(false);
  let [pingthere, setPingThere] = useState(false);
  let socket = props.socket;
  let [imageWindow, setImageWindow] = useState(false);

  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const currentMainCont = useSelector((state) => state.currentMainCont);
  const USERDATA = useSelector((state) => state.USERDATA);
  let [message, setMessage] = useState("");
  // let message;

  if (!props.data.type.includes("image")) {
    let x = props.data.message.replace(
      urlRegex({ strict: false }),
      function (url) {
        if (!linkthere) setLinkThere(true);
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      }
    );
    replaceAsync(x, /@([A-Z])?([0-9])?\w+/g, async (user) => {
      if (!pingthere) setPingThere(true);
      // check whether user exists
      let { data } = await axios.post(`${CONSTANTS.ip}/api/checkUserExists`, {
        id: String(user).substring(1),
      });
      return data;
    }).then((str) => setMessage(str));
  }

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
  const [profileId, setProfileId] = useState(generateUniqueId());
  let ContextMenu = useSelector((state) => state.contextMenu);

  let messageRef = useRef();

  let dispatch = useDispatch();

  const [userProfileData, setUserProfileData] = useState({
    name: "",
    image: "",
    aboutMe: "",
    coverImage: "",
  });

  function contextMenuHandler(e) {
    e.preventDefault();
    if (
      e.target.classList.contains("messageImg") ||
      e.target.classList.contains("Backdrop")
    )
      return;
    console.log("yes");
    e.pageX + 150 > window.innerWidth
      ? setX(`${window.innerWidth - 180}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 200 > window.innerHeight
      ? setY(`${window.innerHeight - 220}px`)
      : setY(`${e.pageY}px`);

    // dispatch(ContextMenuActions.loadMenu(Id));
  }

  async function profileClickHandler(e) {
    e.preventDefault();
    let target = e.target.closest(".profileTrigger");
    let userId = props.data.from;
    if (!target) {
      target = e.target.closest(".profileTriggerReply");
      if (!target) return;
      userId = props.reply.userId;
    }

    e.pageX + 150 > window.innerWidth
      ? setX(`${window.innerWidth - 180}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 200 > window.innerHeight
      ? setY(`${window.innerHeight - 220}px`)
      : setY(`${e.pageY}px`);

    let { data } = await axios.post(`${CONSTANTS.ip}/api/getUserBasicData`, {
      id: userId,
    });

    setUserProfileData({
      name: data.user.name,
      image: data.user.image,
      aboutMe: data.user.aboutMe,
      coverImage: data.user.coverImage,
    });

    dispatch(ContextMenuActions.loadMenu(profileId));
  }

  useEffect(() => {
    messageRef.current.addEventListener("contextmenu", contextMenuHandler);
    messageRef.current.addEventListener("click", profileClickHandler);

    return () => {
      messageRef.current?.removeEventListener(
        "contextmenu",
        contextMenuHandler
      );
      messageRef.current?.removeEventListener("click", profileClickHandler);
    };
  });

  // EDIT MESSAGE
  let editInput = useRef();
  let [editInputVal, setEditInputVal] = useState(props.data.message);
  let [isEdit, setIsEdit] = useState(false);

  async function editFormHandler(e) {
    e.preventDefault();
    if (editInputVal.trim() === "" || editInputVal.trim() === message) {
      setEditInputVal(message);
      setIsEdit(false);
      return;
    }
    let data = await axios.post(`${CONSTANTS.ip}/api/editMessage`, {
      messageId: props.data.objId,
      dmId: currentMainCont.id,
      message: editInputVal.trim(),
    });
    if (data.data.status === "ok") {
      setMessage(editInputVal.trim());
      // message = editInputVal.trim();
      data = data.data.obj;
      let final = {
        objId: data._id,
        dmId: data.dmId,
        message: data.message,
        from: data.userId,
        name: data.name,
        image: USERDATA.image,
        createdAt: data.createdAt,
        type: data.type,
      };
      socket.emit("edit_message-dm", currentMainCont.id, final);
      dispatch(dmMessagesAction.updateMessage(final));
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
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      }}
    >
      {props.data.type.includes("reply") && (
        <div className="DirectMessages-reply-Cont">
          <i class="ph-arrow-elbow-left-down-bold"></i>
          <img
            src={`/Images/${props.reply.image}`}
            className="profileTriggerReply"
          />
          <h2
            style={
              props.reply.userId === USERDATA.id
                ? { color: "#84a59d" }
                : { color: "#9f85ff" }
            }
            className="profileTriggerReply"
          >
            {props.reply.name}
          </h2>
          <span>
            {props.reply.replyMessage.length > 200
              ? "File"
              : props.reply.replyMessage}
          </span>
        </div>
      )}
      <div className="DirectMessagesBody-Message_Details">
        <img src={`/Images/${props.data.image}`} className="profileTrigger" />
        <h2
          className="profileTrigger"
          style={
            props.data.from === USERDATA.id
              ? { color: "#84a59d" }
              : { color: "#9f85ff" }
          }
        >
          {props.data.name}
        </h2>
        <span>{dateString}</span>
      </div>
      <div className="DirectMessagesBody-Message_Body">
        {isEdit ||
          (!String(props.data.type).includes("image") && (
            <p>{linkthere || pingthere ? parse(message) : message}</p>
          ))}
        {String(props.data.type).includes("image") && (
          <React.Fragment>
            <img
              src={`data:image/${props.data.message.ext};base64,${props.data.message.file}`}
              className="messageImg"
              style={{ cursor: "pointer" }}
              onClick={() => setImageWindow(true)}
            />
            <AnimatePresence initial={false} exitBeforeEnter={true}>
              {imageWindow && (
                <motion.div className="ImageFullWindow">
                  <motion.div
                    className="Backdrop"
                    onClick={() => setImageWindow(false)}
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
                        duration: 0.2,
                      },
                    }}
                  ></motion.div>
                  <motion.img
                    src={`data:image/${props.data.message.ext};base64,${props.data.message.file}`}
                    className="messageImgFullScreen"
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
                        duration: 0.2,
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        )}
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
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={editFormHandler}
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
        {ContextMenu.id === profileId && (
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              return;
            }}
            className="DirectMessages_UserProfileContext"
            style={{
              top: y,
              left: x,
            }}
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
          >
            <div className="ImgCont">
              {userProfileData.coverImage !== "undefined" ? (
                <img src={`/Images/${userProfileData.coverImage}`} />
              ) : (
                <div className="NOCoverImage"></div>
              )}
              <img
                src={`/Images/${userProfileData.image}`}
                className="userProfileImage"
              />
            </div>
            <div className="userProfileData">
              <span>{userProfileData.name}</span>
              <p>{props.data.from}</p>
            </div>
            {userProfileData.aboutMe === "undefined" ? (
              ""
            ) : (
              <div className="userProfileAboutMe">
                <span>About Me</span>
                <p>{userProfileData.aboutMe}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {/* {ContextMenu.id === Id && (
          <motion.div
            className="DirectMessages_MessageContextMenu"
            style={{
              top: y,
              left: x,
            }}
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }}
          >
            {!props.data.type.includes("image") &&
              !props.data.type.includes("reply") &&
              props.data.from === USERDATA.id && (
                <motion.div
                  className="ContextMenuOption"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEdit(true)}
                >
                  <i class="ph-pen-bold"></i>
                  <span>Edit Message</span>
                </motion.div>
              )}
            <motion.div
              className="ContextMenuOption"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setReply({
                  type: "SETDATA",
                  data: {
                    status: true,
                    name: props.data.name,
                    messageId: props.data.objId,
                    replyingTo: props.data.from,
                  },
                })
              }
            >
              <i class="ph-paper-plane-tilt-bold"></i>
              <span>Reply</span>
            </motion.div>
          </motion.div>
        )} */}
      </AnimatePresence>
    </motion.div>
  );
}

export default DirectMessages_Message;
