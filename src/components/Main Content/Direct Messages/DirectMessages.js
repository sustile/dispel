import React, { useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DirectMessages.css";
import DirectMessagesHeader from "./DirectMessagesHeader";
import DirectMessages_Message from "./DirectMessages_Message";

import { dmMessagesAction } from "./../../Store/store";
import { useEffect } from "react";
import axios from "axios";

function DirectMessages(props) {
  let socket = props.socket;
  let vcPeer = props.vcPeer;
  let inputRef = useRef();
  let messageCont = useRef();

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.USERDATA);
  const allDmMessages = useSelector((state) => state.allDmMessages);
  const currentCont = useSelector((state) => state.currentMainCont);
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  let currentDmData = allDmMessages.filter((el) => el.dmId === currentCont.id);
  if (currentDmData.length === 0) currentDmData = { page: 1, isMaximum: false };
  else currentDmData = currentDmData[0];

  let [toBeRendered, setToBeRendered] = useState([]);

  async function inputHandler(e) {
    e.preventDefault();

    if (inputRef.current.value.trim() === "") return;
    let final = {
      message: inputRef.current.value.trim(),
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
          dmId: props.data.id,
          message: inputRef.current.value.trim(),
          from: userData.id,
          name: userData.name,
          image: userData.image,
          createdAt: data.obj.createdAt,
        })
      );
    }

    inputRef.current.value = "";
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
      if (allDmMessages.length === 0) {
        let data = await getMessagesFromServer(
          currentCont.id,
          currentDmData.page
        );
        if (data.status === "ok") {
          if (data.result.length !== 0) {
            for (let el of data.result) {
              let user = await axios.post(
                `${CONSTANTS.ip}/api/getUserBasicData`,
                {
                  id: el.userId,
                }
              );
              dispatch(
                dmMessagesAction.addMessage({
                  objId: el._id,
                  dmId: props.data.id,
                  message: el.message,
                  from: el.userId,
                  name: user.data.user.name,
                  image: user.data.user.image,
                  createdAt: el.createdAt,
                })
              );
            }
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
              for (let el of data.result) {
                let user = await axios.post(
                  `${CONSTANTS.ip}/api/getUserBasicData`,
                  {
                    id: el.userId,
                  }
                );
                dispatch(
                  dmMessagesAction.addMessage({
                    objId: el._id,
                    dmId: props.data.id,
                    message: el.message,
                    from: el.userId,
                    name: user.data.user.name,
                    image: user.data.user.image,
                    createdAt: el.createdAt,
                  })
                );
              }
            }
          }
        }
      }
    })();
  }, [currentCont.id]);

  useEffect(() => {
    let x = allDmMessages.filter((el) => el.dmId === currentCont.id);
    if (x.length > 0) {
      x = x[0];
    } else {
      x = undefined;
    }
    if (x) {
      setToBeRendered(
        x.messages.map((el) => (
          <DirectMessages_Message key={el._id} data={el} />
        ))
      );

      setTimeout(() => {
        if (currentDmData.page > 1) return;
        messageCont.current.scroll({
          top: messageCont.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } else {
      setToBeRendered([]);
    }
  }, [currentDmData.messages, currentCont.id]);

  function scrollHandler(e) {
    let main = e.target;
    if (main.scrollTop === 0) {
      if (main.scrollHeight === main.clientHeight) return;
      setTimeout(async () => {
        if (main.scrollTop === 0) {
          if (currentDmData.isMaximum) return;

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

              for (let el of data.result) {
                let user = await axios.post(
                  `${CONSTANTS.ip}/api/getUserBasicData`,
                  {
                    id: el.userId,
                  }
                );
                dispatch(
                  dmMessagesAction.addMessage({
                    objId: el._id,
                    dmId: props.data.id,
                    message: el.message,
                    from: el.userId,
                    name: user.data.user.name,
                    image: user.data.user.image,
                    createdAt: el.createdAt,
                    lazyLoad: true,
                  })
                );
              }
            } else {
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

  return (
    <div className="DirectMessages-Wrapper">
      <DirectMessagesHeader
        name={props.data.name}
        socket={socket}
        vcPeer={props.vcPeer}
      />
      <div
        className="DirectMessagesBody-MessageWrapper"
        ref={messageCont}
        onScroll={scrollHandler}
      >
        {toBeRendered}
      </div>
      <div className="DirectMessages-InputWrapper">
        <form onSubmit={inputHandler}>
          <input
            type="text"
            placeholder={`Send a Message to ${props.data.name}`}
            maxLength="200"
            minLength="1"
            ref={inputRef}
          />
        </form>
      </div>
    </div>
  );
}

export default DirectMessages;
