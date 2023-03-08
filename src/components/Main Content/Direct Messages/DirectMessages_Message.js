import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContextMenuActions } from "../../Store/store";

import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import generateUniqueId from "generate-unique-id";
import axios from "axios";
import { dmMessagesAction } from "../../Store/store";
import urlRegex from "url-regex";
import { set } from "mongoose";

function DirectMessages_Message(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [profileId, setProfileId] = useState(generateUniqueId());
  const [userProfileData, setUserProfileData] = useState({
    name: "",
    image: "",
    aboutMe: "",
    coverImage: "",
  });

  function formatMessageURL(message = "") {
    try {
      message = message.replace(urlRegex({ strict: false }), (url) => {
        return `<l:::${url}:::l>`;
      });

      let n = [];
      let exists = false;

      message.split(" ").forEach((el) => {
        if (el.includes("<l:::")) {
          let a, b, x;
          let y = el;
          while (true) {
            if (!y.includes("<l:::")) break;
            a = y.indexOf("<l::") + 4;
            b = y.indexOf(":::l>");
            x = y.substring(a + 1, b);
            if (!x) return;
            n.push(y.substring(0, a - 4));
            n.push(x);
            if (!exists) exists = true;
            if (y.charAt(b + 5) == "") {
              n.push(" ");
            } else if (el.length === b + 1) {
              n.push(y.charAt(b + 1));
            }
            y = y.substring(b + 5);
          }
        } else {
          n.push(el + " ");
        }
      });
      return [n, exists];
    } catch (e) {
      console.log("Error :", e);
    }
  }
  function formatMessagePing(message = "") {
    try {
      message = message.replace(/<@([A-Z])?([0-9])?\w+>/g, (user) => {
        return `${user.substring(1, user.length - 1)}`;
      });

      message = message.replace(/@([A-Z])?([0-9])?\w+/g, (user) => {
        return `<${user}>`;
      });

      let n = [];

      message.split(" ").forEach((el) => {
        if (el.includes("<@")) {
          let a, b, x;
          let y = el;
          while (true) {
            if (!y.includes("<@")) break;
            a = y.indexOf("<");

            b = y.indexOf(">");

            x = y.substring(a + 1, b);
            if (!x) return;
            n.push(y.substring(0, a));
            n.push(x);
            if (y.charAt(b + 1) == "") {
              n.push(" ");
            } else if (el.length === b + 1) {
              n.push(y.charAt(b + 1));
            }
            y = y.substring(b + 1);
          }
        } else {
          n.push(el + " ");
        }
      });
      return n;
    } catch (e) {
      console.log("Error : ", e);
    }
  }

  let date = new Date(props.data.createdAt);
  let setReply = props.setReply;
  let [formated, setFormated] = useState(false);
  let socket = props.socket;
  let [imageWindow, setImageWindow] = useState(false);

  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const currentMainCont = useSelector((state) => state.currentMainCont);
  const USERDATA = useSelector((state) => state.USERDATA);
  let [message, setMessage] = useState(props.data.message);
  let [formattedMessage, setFormattedMessage] = useState([]);

  useEffect(() => {
    (async () => {
      if (!props.data.type.includes("image")) {
        let [x, exists] = formatMessageURL(message);
        if (exists && !formated) setFormated(true);

        // setMessage(x);
        let y = formatMessagePing(x.join(""));
        let newY = [];
        let dmData = await axios.post(`${CONSTANTS.ip}/api/getDMUsers`, {
          dm: currentMainCont.id,
        });
        dmData = dmData.data;
        for (let el of y) {
          if (el[0] === "@" && el.length > 5) {
            if (dmData.status !== "ok") return;
            // let x = dmData.users.filter(
            //   (y) => el.id === String(y).substring(1)
            // );
            // console.log(x);
            if (
              dmData.users.filter((y) => y.id === String(el).substring(1))
                .length === 0
            ) {
              newY.push(el);
            } else {
              let { data } = await axios.post(
                `${CONSTANTS.ip}/api/checkUserExists`,
                {
                  id: String(el).substring(1),
                }
              );
              if (data.status === "ok") {
                if (!formated) setFormated(true);
                newY.push(
                  React.createElement(UserPing, {
                    name: `@${data.name}`,
                    setX: (x) => {
                      setX(x);
                    },
                    setY: (y) => {
                      setY(y);
                    },
                    profileId: profileId,
                    setUserProfileData: (y) => {
                      setUserProfileData(y);
                    },
                    userId: String(el).substring(1),
                  })
                );
              } else {
                newY.push(el);
              }
            }
          } else if (String(el).includes("http") && exists) {
            let check = false;
            try {
              check = Boolean(new URL(el));
            } catch (e) {
              check = false;
            }
            if (check) {
              newY.push(
                React.createElement("a", { href: el, target: "_blank" }, el)
              );
            } else {
              newY.push(el);
            }
          } else {
            newY.push(el);
          }
        }

        setFormattedMessage(newY);
      }
    })();
  }, [props.data.message]);

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

  const [Id, setId] = useState(generateUniqueId());
  let ContextMenu = useSelector((state) => state.contextMenu);

  let messageRef = useRef();

  let dispatch = useDispatch();

  function contextMenuHandler(e) {
    e.preventDefault();
    if (
      e.target.classList.contains("messageImg") ||
      e.target.classList.contains("Backdrop")
    )
      return;
    e.pageX + 180 > window.innerWidth
      ? setX(`${window.innerWidth - 200}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 90 > window.innerHeight
      ? setY(`${window.innerHeight - 90}px`)
      : setY(`${e.pageY}px`);

    dispatch(ContextMenuActions.loadMenu(Id));
  }

  async function profileClickHandler(e) {
    // e.preventDefault();
    let target = e.target.closest(".profileTrigger");
    let userId = props.data.from;
    if (!target) {
      target = e.target.closest(".profileTriggerReply");
      if (!target) return;
      userId = props.reply.userId;
    }
    // if(!target){
    //   target = e.target.closest(".userPing");
    //   if(!target) return
    //   userId =
    // }

    // e.pageX + 150 > window.innerWidth
    //   ? setX(`${window.innerWidth - 180}px`)
    //   : setX(`${e.pageX}px`);
    // e.pageY + 200 > window.innerHeight
    //   ? setY(`${window.innerHeight - 220}px`)
    //   : setY(`${e.pageY}px`);

    e.pageX + 360 > window.innerWidth
      ? setX(`${window.innerWidth - 360}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 320 > window.innerHeight
      ? setY(`${window.innerHeight - 370}px`)
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
      setIsEdit(false);
    } else {
      setEditInputVal(message);
      setIsEdit(false);
    }
  }

  useEffect(() => {
    if (isEdit) {
      editInput.current.style.height = `4.8rem`;
      let scHeight = editInput.current.scrollHeight;
      editInput.current.style.height = `${scHeight}px`;
    }
  }, [isEdit]);

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
      {/* <div className="ectMessagesBody-Message_Details"> */}
      <div className="DirectMessagesBody-Message-masterCont">
        <img
          src={`/Images/${props.data.image}`}
          className="profileTrigger profileImage"
        />
        {/* <h2
          className="profileTrigger"
          style={
            props.data.from === USERDATA.id
              ? { color: "#84a59d" }
              : { color: "#9f85ff" }
          }
        >
          {props.data.name}
        </h2>
        <span>{dateString}</span> */}
        {/* </div> */}
        <div className="DirectMessagesBody-Message_Body">
          <div className="DirectMessagesBody-Message_Body-details">
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
            <span className="dateString">{dateString}</span>
          </div>
          {isEdit ||
            (!String(props.data.type).includes("image") && (
              <p>{formated ? formattedMessage : message}</p>
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
                <textarea
                  placeholder="Enter The new Message"
                  maxLength="200"
                  minLength="1"
                  ref={editInput}
                  className="editMessageInput"
                  value={editInputVal}
                  onKeyUp={(e) => {
                    e.target.style.height = `4.8rem`;
                    let scHeight = e.target.scrollHeight;
                    e.target.style.height = `${scHeight}px`;
                  }}
                  onChange={(e) => setEditInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                      // inputHandler(e);
                      e.preventDefault();
                      return;
                    }
                  }}
                />
                {/* <input
                  ref={editInput}
                  onChange={(e) => setEditInputVal(e.target.value)}
                  type="text"
                  value={editInputVal}
                  placeholder="Enter The new Message"
                  maxLength="200"
                  minLength="1"
                  className="editMessageInput"
                /> */}
                <motion.div className="BtnsCont">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={editFormHandler}
                  >
                    Confirm Edit
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
        {ContextMenu.id === Id && (
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UserPing(props) {
  let dispatch = useDispatch();
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  async function clickHandler(e) {
    e.pageX + 360 > window.innerWidth
      ? props.setX(`${window.innerWidth - 360}px`)
      : props.setX(`${e.pageX}px`);
    e.pageY + 320 > window.innerHeight
      ? props.setY(`${window.innerHeight - 370}px`)
      : props.setY(`${e.pageY}px`);

    let { data } = await axios.post(`${CONSTANTS.ip}/api/getUserBasicData`, {
      id: props.userId,
    });

    props.setUserProfileData({
      name: data.user.name,
      image: data.user.image,
      aboutMe: data.user.aboutMe,
      coverImage: data.user.coverImage,
    });

    dispatch(ContextMenuActions.loadMenu(props.profileId));
  }

  return (
    <span className="userPing" onClick={clickHandler}>
      {props.name}
    </span>
  );
}

export default DirectMessages_Message;
