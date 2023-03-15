import React, { useReducer, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DirectMessages.css";
import DirectMessagesHeader from "./DirectMessagesHeader";
import DirectMessages_Message from "./DirectMessages_Message";
import Fuse from "fuse.js";
import EmojiPicker from "emoji-picker-react";

import {
  dmMessagesAction,
  spinnerActions,
  notificationsAction,
} from "./../../Store/store";
import { useEffect } from "react";
import axios from "axios";
import DirectMessages_MessageMenu from "../../ContextMenus/DirectMessages_MessageMenu";
import { AnimatePresence, motion } from "framer-motion";

function replyReducerFunction(state, action) {
  if (action.type === "SETDATA") {
    return { ...action.data };
  } else if (action.type === "RESET") {
    return { status: false, messageId: "", name: "", replyingTo: "" };
  }
  return {
    status: false,
    messageId: "",
    name: "",
    replyingTo: "",
  };
}

function DirectMessages(props) {
  let socket = props.socket;
  let vcPeer = props.vcPeer;
  let inputRef = useRef();
  let messageCont = useRef();
  let formRef = useRef();

  let [showContextMenu, setShowContextMenu] = useState(false);
  let [inputFocus, setInputFocus] = useState(false);
  let [fuzzyCurrent, setfuzzyCurrent] = useState(false);
  let [dmData, setDmData] = useState(false);
  let [textBoxCount, setTextBoxCount] = useState(0);
  let [emojiPicker, setEmojiPicker] = useState(false);
  let [fileUploadshow, setfileUploadshow] = useState(false);
  let [reply, replyReducer] = useReducer(replyReducerFunction, {
    status: false,
    messageId: "",
    name: "",
    replyingTo: "",
  });

  let [dummyText, setDummyText] = useState({
    status: false,
    reply: false,
    image: false,
  });

  let [pingRender, setPingRender] = useState([]);

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.USERDATA);
  const allDmMessages = useSelector((state) => state.allDmMessages);
  const currentCont = useSelector((state) => state.currentMainCont);
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const spinnerState = useSelector((state) => state.spinner);

  let currentDmData = allDmMessages.filter((el) => el.dmId === currentCont.id);
  if (currentDmData.length === 0) currentDmData = { page: 1, isMaximum: false };
  else currentDmData = currentDmData[0];

  let [toBeRendered, setToBeRendered] = useState([]);
  let [noData, setNoData] = useState(false);

  function setReply(e) {
    replyReducer(e);
  }

  async function inputHandler(e) {
    if (e) {
      e.preventDefault();
    }

    if (inputRef.current.value.trim() === "") return;

    // console.log(inputRef.current.value.split("\n"));

    if (reply.status) {
      setDummyText({
        status: true,
        reply: true,
        image: false,
      });
      let final = {
        message: inputRef.current.value.trim(),
        type: "reply",
        from: userData.id,
        name: userData.name,
        image: userData.image,
        room: props.data.id,
        socketId: socket.id,
        replyTo: reply.replyingTo,
        replyMessage: reply.messageId,
      };

      let { data } = await axios.post(`${CONSTANTS.ip}/api/saveMessage`, {
        dmId: props.data.id,
        type: "reply",
        message: final.message,
        replyTo: reply.replyingTo,
        replyMessage: reply.messageId,
      });

      if (data.status === "ok") {
        final.objId = data.obj._id;
        final.createdAt = data.obj.createdAt;
        socket.emit("send-message_dm", final);
        dispatch(
          dmMessagesAction.addMessage({
            objId: data.obj._id,
            type: "reply",
            replyTo: reply.replyingTo,
            replyMessage: reply.messageId,
            dmId: props.data.id,
            message: inputRef.current.value.trim(),
            from: userData.id,
            name: userData.name,
            image: userData.image,
            createdAt: data.obj.createdAt,
          })
        );
        // setDummyText({
        //   status: false,
        //   reply: false,
        //   image: false,
        // });
      }
    } else {
      setDummyText({
        status: true,
        reply: false,
        image: false,
      });
      let final = {
        message: inputRef.current.value.trim(),
        type: "normal",
        from: userData.id,
        name: userData.name,
        image: userData.image,
        room: props.data.id,
        socketId: socket.id,
      };

      let { data } = await axios.post(`${CONSTANTS.ip}/api/saveMessage`, {
        dmId: props.data.id,
        type: "normal",
        message: final.message,
      });

      if (data.status === "ok") {
        final.objId = data.obj._id;
        final.createdAt = data.obj.createdAt;
        socket.emit("send-message_dm", final);
        dispatch(
          dmMessagesAction.addMessage({
            objId: data.obj._id,
            type: "normal",
            dmId: props.data.id,
            message: inputRef.current.value.trim(),
            from: userData.id,
            name: userData.name,
            image: userData.image,
            createdAt: data.obj.createdAt,
          })
        );

        // setDummyText({
        //   status: false,
        //   reply: false,
        //   image: false,
        // });
      }
    }

    setfuzzyCurrent(false);
    setTextBoxCount(0);
    setPingRender([]);
    inputRef.current.value = "";
    inputRef.current.style.height = "4.8rem";
    setReply({
      type: "RESET",
    });
  }

  async function getMessagesFromServer(dmId, page) {
    let dm = await axios.post(`${CONSTANTS.ip}/api/lazyLoadMessages`, {
      dmId,
      page,
    });
    dm.data.result.reverse();
    return dm.data;
  }

  useEffect(() => {
    (async () => {
      // socket.emit("dm-call-data", currentCont.id);
      dispatch(spinnerActions.toggleSpinner(true));

      if (allDmMessages.length === 0) {
        let data = await getMessagesFromServer(
          currentCont.id,
          currentDmData.page
        );
        if (data.status === "ok") {
          if (data.result.length !== 0) {
            let user;
            for (let el of data.result) {
              if (el.userId !== userData.id && !user) {
                user = await axios.post(
                  `${CONSTANTS.ip}/api/getUserBasicData`,
                  {
                    id: el.userId,
                  }
                );
              }
              dispatch(
                dmMessagesAction.addMessage({
                  objId: el._id,
                  dmId: props.data.id,
                  type: el.type,
                  message: el.message,
                  from: el.userId,
                  name:
                    el.userId === userData.id
                      ? userData.name
                      : user.data.user.name,
                  image:
                    el.userId === userData.id
                      ? userData.image
                      : user.data.user.image,
                  createdAt: el.createdAt,
                  replyTo: el.replyTo,
                  replyMessage: el.replyMessage,
                })
              );
            }
          } else {
            dispatch(spinnerActions.toggleSpinner(false));
          }
        }
      } else {
        let x = allDmMessages.filter((el) => el.dmId === currentCont.id);
        if (x.length > 0) {
          x = x[0];
        } else {
          x = undefined;
        }
        if (!x) {
          let data = await getMessagesFromServer(
            currentCont.id,
            currentDmData.page
          );
          if (data.status === "ok") {
            if (data.result.length !== 0) {
              let user;
              for (let el of data.result) {
                if (el.userId !== userData.id && !user) {
                  user = await axios.post(
                    `${CONSTANTS.ip}/api/getUserBasicData`,
                    {
                      id: el.userId,
                    }
                  );
                }
                dispatch(
                  dmMessagesAction.addMessage({
                    objId: el._id,
                    dmId: props.data.id,
                    type: el.type,
                    message: el.message,
                    from: el.userId,
                    name:
                      el.userId === userData.id
                        ? userData.name
                        : user.data.user.name,
                    image:
                      el.userId === userData.id
                        ? userData.image
                        : user.data.user.image,
                    createdAt: el.createdAt,
                    replyTo: el.replyTo,
                    replyMessage: el.replyMessage,
                  })
                );
              }
            } else {
              dispatch(spinnerActions.toggleSpinner(false));
            }
          }
        }
        // else {
        //   dispatch(spinnerActions.toggleSpinner(false));
        // }
      }
    })();
  }, [currentCont.id]);

  function setContextMenu(e) {
    setShowContextMenu(e);
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      let x = allDmMessages.filter((el) => el.dmId === currentCont.id);
      if (x.length > 0) {
        x = x[0];
        if (x.length > 5) {
          dispatch(spinnerActions.toggleSpinner(true));
        }
      } else {
        x = undefined;
      }
      if (x) {
        let final = [];

        let user;
        for (let el of x.messages) {
          if (el.type.includes("reply")) {
            if (el.replyTo !== userData.id && !user) {
              user = await axios.post(`${CONSTANTS.ip}/api/getUserBasicData`, {
                id: el.replyTo,
              });
            }

            let x = await axios.post(`${CONSTANTS.ip}/api/getMessageData`, {
              id: el.replyMessage,
            });

            x = x.data.result[0];

            let y = {
              image:
                el.replyTo === userData.id
                  ? userData.image
                  : user.data.user.image,
              name:
                el.replyTo === userData.id
                  ? userData.name
                  : user.data.user.name,
              replyMessage: x.message,
              userId: x.userId,
              replyMessageId: x._id,
            };

            if (el.type.includes("image")) {
              let message = {
                ext: el.ext,
                file: el.message,
              };
              final.push(
                <DirectMessages_Message
                  key={el.objId}
                  data={{ ...el, message }}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setContextMenu}
                  setReply={setReply}
                  reply={y}
                  socket={socket}
                />
              );
              // setToBeRendered((state) => [
              //   ...state,
              //   <DirectMessages_Message
              //     key={el.objId}
              //     data={{ ...el, message }}
              //     showContextMenu={showContextMenu}
              //     setShowContextMenu={setContextMenu}
              //     setReply={setReply}
              //     reply={y}
              //     socket={socket}
              //   />,
              // ]);
            } else {
              final.push(
                <DirectMessages_Message
                  key={el.objId}
                  data={el}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setContextMenu}
                  setReply={setReply}
                  reply={y}
                  socket={socket}
                />
              );
              // setToBeRendered((state) => [
              //   ...state,
              //   <DirectMessages_Message
              //     key={el.objId}
              //     data={el}
              //     showContextMenu={showContextMenu}
              //     setShowContextMenu={setContextMenu}
              //     setReply={setReply}
              //     reply={y}
              //     socket={socket}
              //   />,
              // ]);
            }
          } else {
            if (el.type.includes("image")) {
              let message = {
                ext: el.ext,
                file: el.message,
              };
              final.push(
                <DirectMessages_Message
                  key={el.objId}
                  data={{ ...el, message }}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setContextMenu}
                  setReply={setReply}
                  socket={socket}
                />
              );
              // setToBeRendered((state) => [
              //   ...state,
              //   <DirectMessages_Message
              //     key={el.objId}
              //     data={{ ...el, message }}
              //     showContextMenu={showContextMenu}
              //     setShowContextMenu={setContextMenu}
              //     setReply={setReply}
              //     socket={socket}
              //   />,
              // ]);
            } else {
              final.push(
                <DirectMessages_Message
                  key={el.objId}
                  data={el}
                  showContextMenu={showContextMenu}
                  setShowContextMenu={setContextMenu}
                  setReply={setReply}
                  socket={socket}
                />
              );
              // setToBeRendered((state) => [
              //   ...state,
              //   <DirectMessages_Message
              //     key={el.objId}
              //     data={el}
              //     showContextMenu={showContextMenu}
              //     setShowContextMenu={setContextMenu}
              //     setReply={setReply}
              //     socket={socket}
              //   />,
              // ]);
            }
          }
        }

        if (final.length === 0) {
          setNoData(true);
        }

        setDummyText({
          status: false,
          reply: false,
          image: false,
        });
        dispatch(spinnerActions.toggleSpinner(false));
        setToBeRendered(final);

        setTimeout(() => {
          if (currentDmData.page > 1) return;
          messageCont.current.scroll({
            top: messageCont.current.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      } else {
        dispatch(spinnerActions.toggleSpinner(false));
        setToBeRendered([]);
        setNoData(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentDmData.messages, currentCont.id]);

  function scrollHandler(e) {
    let main = e.target;
    if (spinnerState) return;
    let scrollBtm = main.clientHeight - main.scrollTop;
    if (
      scrollBtm === main.scrollHeight &&
      main.scrollHeight !== main.clientHeight
    ) {
      setTimeout(async () => {
        if (spinnerState) return;
        scrollBtm = main.clientHeight - main.scrollTop;
        if (
          scrollBtm === main.scrollHeight &&
          main.scrollHeight !== main.clientHeight
        ) {
          if (currentDmData.isMaximum) return;
          // console.log("trigerring render");
          dispatch(spinnerActions.toggleSpinner(true));
          let data = await getMessagesFromServer(
            currentCont.id,
            currentDmData.page + 1
          );
          data.result.reverse();
          if (data.status === "ok") {
            if (data.result.length !== 0) {
              dispatch(
                dmMessagesAction.updatePage({
                  dmId: currentCont.id,
                  page: currentDmData.page + 1,
                })
              );

              let user;
              for (let el of data.result) {
                if (el.userId !== userData.id && !user) {
                  user = await axios.post(
                    `${CONSTANTS.ip}/api/getUserBasicData`,
                    {
                      id: el.userId,
                    }
                  );
                }
                dispatch(
                  dmMessagesAction.addMessage({
                    objId: el._id,
                    type: el.type,
                    dmId: props.data.id,
                    message: el.message,
                    from: el.userId,
                    name:
                      el.userId === userData.id
                        ? userData.name
                        : user.data.user.name,
                    image:
                      el.userId === userData.id
                        ? userData.image
                        : user.data.user.image,
                    createdAt: el.createdAt,
                    replyTo: el.replyTo,
                    replyMessage: el.replyMessage,
                    lazyLoad: true,
                  })
                );
              }
            } else {
              dispatch(spinnerActions.toggleSpinner(false));
              dispatch(
                dmMessagesAction.updateMaximum({
                  dmId: currentCont.id,
                  isMaximum: true,
                })
              );
            }
          }
        }
      }, 1000);
    }
  }

  async function fileHandler(e) {
    // let file = [...e.target.files];
    let file = e;
    file = file.filter((el) => {
      if (el.size / 1000000 <= 10) return el;
    });

    for (let el of file) {
      const reader = new FileReader();
      reader.onload = async function () {
        let file = this.result.replace(/.*base64,/, "");
        const message = {
          name: el.name,
          ext: String(el.name).split(".")[1],
          file,
        };

        if (reply.status) {
          setDummyText({
            status: true,
            reply: true,
            image: true,
          });
          let final = {
            message: file,
            type: "reply-image",
            from: userData.id,
            name: userData.name,
            image: userData.image,
            room: props.data.id,
            socketId: socket.id,
            replyTo: reply.replyingTo,
            replyMessage: reply.messageId,
          };

          let { data } = await axios.post(`${CONSTANTS.ip}/api/saveMessage`, {
            dmId: props.data.id,
            type: "reply-image",
            message: file,
            ext: String(el.name).split(".")[1],
            replyTo: reply.replyingTo,
            replyMessage: reply.messageId,
          });

          if (data.status === "ok") {
            final.objId = data.obj._id;
            final.createdAt = data.obj.createdAt;
            socket.emit("send-message_dm", final);

            dispatch(
              dmMessagesAction.addMessage({
                objId: data.obj._id,
                type: "reply-image",
                replyTo: reply.replyingTo,
                replyMessage: reply.messageId,
                dmId: props.data.id,
                message: file,
                from: userData.id,
                name: userData.name,
                image: userData.image,
                createdAt: data.obj.createdAt,
              })
            );

            // setDummyText({
            //   status: false,
            //   reply: false,
            //   image: false,
            // });
          }
        } else {
          setDummyText({
            status: true,
            reply: false,
            image: true,
          });
          let final = {
            message: file,
            type: "normal-image",
            from: userData.id,
            name: userData.name,
            image: userData.image,
            room: props.data.id,
            socketId: socket.id,
          };

          let { data } = await axios.post(`${CONSTANTS.ip}/api/saveMessage`, {
            dmId: props.data.id,
            type: "normal-image",
            message: file,
            ext: String(el.name).split(".")[1],
          });

          if (data.status === "ok") {
            final.objId = data.obj._id;
            final.createdAt = data.obj.createdAt;
            socket.emit("send-message_dm", final);

            dispatch(
              dmMessagesAction.addMessage({
                objId: data.obj._id,
                type: "normal-image",
                dmId: props.data.id,
                message: file,
                from: userData.id,
                name: userData.name,
                image: userData.image,
                createdAt: data.obj.createdAt,
              })
            );

            // setDummyText({
            //   status: false,
            //   reply: false,
            //   image: false,
            // });
          }
        }
        setReply({
          type: "RESET",
        });
      };
      reader.readAsDataURL(el);
    }
  }

  useEffect(() => {
    (async () => {
      let { data } = await axios.post(`${CONSTANTS.ip}/api/getDMUsers`, {
        dm: currentCont.id,
      });

      setDmData(data.users);
    })();
  }, [currentCont]);

  // useEffect(() => {
  //   setTextBoxCount(inputRef.current.value.length);
  //   console.log(inputRef.current.value.length);
  // }, [inputRef?.current?.value]);

  return (
    <div className="DirectMessages-Wrapper">
      <DirectMessagesHeader
        name={props.data.name}
        socket={socket}
        vcPeer={props.vcPeer}
      />
      <div
        className="DirectMessagesBody-Message-MainWrapper"
        onScroll={scrollHandler}
      >
        <div className="DirectMessagesBody-MessageWrapper" ref={messageCont}>
          {toBeRendered}
          {dummyText.status && (
            <motion.div
              className="DirectMessagesBody-Message"
              // whileHover={{
              //   backgroundColor: "rgb(24, 24, 24)",
              //   transition: {
              //     duration: 0.3,
              //     type: "spring",
              //   },
              // }}
              // initial={{ opacity: 0 }}
              // animate={{
              //   opacity: 1,
              //   transition: {
              //     duration: 0.3,
              //   },
              // }}
            >
              {dummyText.reply && (
                <div className="DirectMessages-reply-Cont">
                  <i class="ph-arrow-elbow-left-down-bold"></i>
                  <div className="dummyImg"></div>
                  <div className="dummyMessage"></div>
                </div>
              )}
              <div className="DirectMessagesBody-Message-masterCont">
                <img
                  src={`/Images/${userData.image}`}
                  className="profileTrigger profileImage"
                />
                <div className="DirectMessagesBody-Message_Body">
                  <div className="DirectMessagesBody-Message_Body-details">
                    <h2 className="profileTrigger" style={{ color: "#84a59d" }}>
                      {userData.name}
                    </h2>
                    <div className="dummyDate"></div>
                  </div>
                  {!dummyText.image && (
                    <React.Fragment>
                      <div
                        className="dummyMessage"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                      <div
                        className="dummyMessage"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                      {/* <div
                        className="dummyMessage"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div> */}
                    </React.Fragment>
                  )}
                  {dummyText.image && <div className="dummyImage"></div>}
                </div>
              </div>
            </motion.div>
          )}

          {/* <DirectMessages_Message
            key="ASDSADASDSA"
            data={{
              name: "Systile",
              image: "default.png",
              id: "03824923023",
              type: "normal",
              message: "test\nlol\ntest2",
              createdAt: "2022-12-13T10:32:27.433+00:00",
            }}
            showContextMenu={showContextMenu}
            setShowContextMenu={setContextMenu}
            setReply={setReply}
          />
          <DirectMessages_Message
            key="ASDSADASDSA"
            data={{
              name: "Systile",
              image: "default.png",
              id: "03824923023",
              type: "normal",
              message: "test\nlol\ntest2",
              createdAt: "2022-12-13T10:32:27.433+00:00",
            }}
            showContextMenu={showContextMenu}
            setShowContextMenu={setContextMenu}
            setReply={setReply}
          /> */}
        </div>

        {toBeRendered.length === 0 && (
          <h2 className="NoMessages">
            Start Chatting with <span>{props.data.name}</span> <br /> to see
            your messages Appear here
          </h2>
        )}
      </div>
      <div
        className={
          reply.status
            ? "DirectMessages-InputWrapper replying"
            : "DirectMessages-InputWrapper"
        }
      >
        <form onSubmit={inputHandler} ref={formRef}>
          <div className="directMessages-input-cont">
            <div
              className={
                inputFocus
                  ? "directMessages-input-cont-primary inputFocused"
                  : "directMessages-input-cont-primary"
              }
            >
              <AnimatePresence initial={false}>
                {(pingRender.length !== 0 || fuzzyCurrent !== false) && (
                  <motion.div
                    className="pingCont"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        style: "spring",
                        duration: 0.1,
                      },
                    }}
                  >
                    {/* <h2>Ping Users</h2> */}
                    <div className="pingCont-primary">
                      {pingRender.map((el) => {
                        return (
                          <motion.div
                            className="PingUser"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileHover={{
                              backgroundColor: "#1a1a1a",
                              scale: 1.01,
                              transition: {
                                duration: 0.3,
                                type: "spring",
                              },
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              transition: {
                                duration: 0.1,
                              },
                            }}
                            whileTap={{
                              scale: 0.99,
                              transition: {
                                duration: 0.3,
                                type: "spring",
                              },
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                              transition: {
                                duration: 0.1,
                              },
                            }}
                            onClick={(e) => {
                              inputRef.current.setRangeText(
                                el.id,
                                fuzzyCurrent + 1,
                                inputRef.current.selectionEnd,
                                "select"
                              );
                              setPingRender([]);
                              setfuzzyCurrent(false);
                            }}
                          >
                            <img src={`/Images/${el.image}`} />
                            <p className="PingUser-name">{el.name}</p>
                            <span>
                              <p>@</p>
                              {el.id}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {reply.status && (
                <div className="ReplyCont">
                  <span>Replying to {reply.name}</span>
                  <i
                    class="ph-x-bold"
                    onClick={() =>
                      replyReducer({
                        type: "RESET",
                      })
                    }
                  ></i>
                </div>
              )}

              <motion.div
                className="inputCont"
                onDragEnter={() => {
                  setfileUploadshow(true);
                }}
                onDragLeave={() => {
                  setfileUploadshow(false);
                }}
              >
                <AnimatePresence initial={false}>
                  {fileUploadshow && (
                    <motion.div
                      className="fileUpload"
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                        translateX: "-50%",
                        translateY: "-50%",
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        translateY: "-200%",
                        transition: {
                          duration: 0.3,
                          type: "spring",
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        translateY: "-50%",
                        transition: {
                          duration: 0.3,
                          type: "spring",
                        },
                      }}
                    >
                      <span>Upload File</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className={`textboxIcons ${
                    inputFocus ||
                    (inputRef.current && inputRef.current.value !== "")
                      ? "textboxIcons_focus"
                      : ""
                  }`}
                >
                  {textBoxCount !== 0 && (
                    <span
                      className={`numberCount ${
                        textBoxCount >= 100 && textBoxCount < 200
                          ? "numberCountMid"
                          : ""
                      } ${textBoxCount === 200 ? "numberCountMax" : ""}`}
                    >
                      {textBoxCount}/200
                    </span>
                  )}

                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="fileInput"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      let final = [...e.target.files].filter((el) => {
                        if (el.type.includes("image/")) {
                          if (el.size / 1000000 <= 10) {
                            return el;
                          } else {
                            dispatch(
                              notificationsAction.setNotification({
                                type: "error",
                                message: "Image Size Exceeds 10MB",
                              })
                            );
                          }
                        }
                      });

                      if (final.length > 0) {
                        fileHandler(final);
                      } else {
                        dispatch(
                          notificationsAction.setNotification({
                            type: "error",
                            message: "File Type(s) Invalid",
                          })
                        );
                      }
                    }}
                  />
                  <label htmlFor="fileInput">
                    <motion.i
                      initial={{
                        scale: 1,
                      }}
                      whileHover={{
                        scale: 1.1,
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
                      class="ph ph-paperclip imageBtn"
                    ></motion.i>
                  </label>

                  <AnimatePresence>
                    {emojiPicker && (
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          inputRef.current.setRangeText(
                            e.emoji,
                            inputRef.current.value.length,
                            inputRef.current.value.length
                          );
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.i
                    initial={{
                      scale: 1,
                    }}
                    whileHover={{
                      scale: 1.1,
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
                    onClick={() => setEmojiPicker((state) => !state)}
                    class={`ph ${
                      emojiPicker ? "ph-x-bold" : "ph-smiley"
                    } emojiBtn`}
                  ></motion.i>
                </div>
                <textarea
                  placeholder={`Send a Message to ${props.data.name}`}
                  maxLength="200"
                  minLength="1"
                  ref={inputRef}
                  onChange={(e) => setTextBoxCount(e.target.value.length)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setfileUploadshow(false);

                    if (e.dataTransfer.items) {
                      let final = [];

                      for (let item of e.dataTransfer.items) {
                        if (
                          item.kind === "file" &&
                          item.type.includes("image/")
                        ) {
                          const file = item.getAsFile();
                          if (file.size / 1000000 <= 10) {
                            final.push(file);
                          } else {
                            dispatch(
                              notificationsAction.setNotification({
                                type: "error",
                                message: "Image Size Exceeds 10MB",
                              })
                            );
                          }
                        }
                      }

                      if (final.length > 0) {
                        fileHandler(final);
                      } else {
                        dispatch(
                          notificationsAction.setNotification({
                            type: "error",
                            message: "File Type(s) Invalid",
                          })
                        );
                      }
                    } else {
                      dispatch(
                        notificationsAction.setNotification({
                          type: "error",
                          message: "Only Images can be Uploaded",
                        })
                      );
                    }
                  }}
                  onInput={async (e) => {
                    if (
                      e.nativeEvent.data === "@" ||
                      e.target.value[e.target.value.length - 1] === "@"
                    ) {
                      setfuzzyCurrent(inputRef.current.selectionStart - 1);
                      let { data } = await axios.post(
                        `${CONSTANTS.ip}/api/getDMUsers`,
                        {
                          dm: currentCont.id,
                        }
                      );
                      setDmData(data.users);
                      setPingRender(data.users);
                    } else if (
                      (fuzzyCurrent &&
                        e.target.value.length - 1 <= fuzzyCurrent) ||
                      e.target.value.length === 0
                    ) {
                      // console.log("setting to false");
                      setPingRender([]);
                      setfuzzyCurrent(false);
                    } else if (
                      fuzzyCurrent !== false &&
                      e.target.value.length - 1 > fuzzyCurrent
                    ) {
                      let str = e.target.value.substring(
                        fuzzyCurrent + 1,
                        e.target.value.length - 1
                      );
                      const fuse = new Fuse(dmData, {
                        keys: ["name", "id"],
                      });

                      const newResults = fuse.search(str);

                      let x = [];
                      for (let el of newResults) {
                        let { data } = await axios.post(
                          `${CONSTANTS.ip}/api/getUserBasicData`,
                          {
                            id: el.item.id,
                          }
                        );
                        x.push({
                          name: data.user.name,
                          id: el.item.id,
                          image: data.user.image,
                        });
                      }
                      setPingRender(x);
                      // console.log(e.nativeEvent.data);
                    }
                  }}
                  onKeyUp={(e) => {
                    e.target.style.height = `4.8rem`;
                    let scHeight = e.target.scrollHeight;
                    e.target.style.height = `${scHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                      inputHandler(e);
                      e.preventDefault();
                      return;
                      // formRef.current.submit();
                    }
                    // e.target.style.height = `auto`;
                    // let scHeight = e.target.scrollHeight;
                    // e.target.style.height = `${scHeight}px`;
                    // if (e.target.value.trim() === "") {
                    //   e.target.style.height = `4.5rem`;
                    // }
                  }}
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                />
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* <DirectMessages_MessageMenu /> */}
    </div>
  );
}

export default DirectMessages;
