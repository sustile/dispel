import React, { useReducer, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DirectMessages.css";
import DirectMessagesHeader from "./DirectMessagesHeader";
import DirectMessages_Message from "./DirectMessages_Message";
import Fuse from "fuse.js";
import { dmMessagesAction, spinnerActions } from "./../../Store/store";
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
  let [showSubmit, setSubmit] = useState(false);
  let [fuzzyCurrent, setfuzzyCurrent] = useState(false);
  let [dmData, setDmData] = useState(false);
  let [reply, replyReducer] = useReducer(replyReducerFunction, {
    status: false,
    messageId: "",
    name: "",
    replyingTo: "",
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
      }
    } else {
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
      }
    }

    setfuzzyCurrent(false);
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
            }
          }
        }

        if (final.length === 0) {
          setNoData(true);
        }

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
    let scrollBtm = Math.floor(main.clientHeight - main.scrollTop);
    if (
      scrollBtm + 1 === main.scrollHeight ||
      scrollBtm - 1 === main.scrollHeight ||
      scrollBtm === main.scrollHeight
    ) {
      if (main.scrollHeight === main.clientHeight) return;
      setTimeout(async () => {
        scrollBtm = Math.floor(main.clientHeight - main.scrollTop);
        if (
          scrollBtm + 1 === main.scrollHeight ||
          scrollBtm - 1 === main.scrollHeight ||
          scrollBtm === main.scrollHeight
        ) {
          if (currentDmData.isMaximum) return;

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
    let file = [...e.target.files];
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
          }
        } else {
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
              <div className="inputCont">
                {/* <input
                  type="text"
                  placeholder={`Send a Message to ${props.data.name}`}
                  maxLength="200"
                  minLength="1"
                  ref={inputRef}
                  // onChange={(e) => {
                  //   if (e.target.value.trim() !== "") {
                  //     if (showSubmit) return;
                  //     setSubmit(true);
                  //   } else {
                  //     setSubmit(false);
                  //   }
                  // }}
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                /> */}

                <textarea
                  placeholder={`Send a Message to ${props.data.name}`}
                  maxLength="200"
                  minLength="1"
                  ref={inputRef}
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
              </div>
            </div>
            {/* <AnimatePresence>
              {showSubmit && (
                <motion.button
                  type="submit"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.2,
                      type: "spring",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      type: "spring",
                    },
                  }}
                >
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
                    className="ph-paper-plane-right-bold submitBtn"
                  ></motion.i>
                </motion.button>
              )}
            </AnimatePresence> */}
            <input
              type="file"
              style={{ display: "none" }}
              id="fileInput"
              accept="image/*"
              multiple
              onChange={fileHandler}
            />
            <label htmlFor="fileInput" className="imageLabel">
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
                class="ph-image-square-bold imageBtn"
              ></motion.i>
            </label>
          </div>
        </form>
      </div>

      {/* <DirectMessages_MessageMenu /> */}
    </div>
  );
}

export default DirectMessages;
