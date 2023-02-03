import React, { useEffect, useMemo } from "react";
import { dmMessagesAction } from "./../Store/store";
import { useSelector, useDispatch } from "react-redux";

import {
  currentCallStatusAction,
  onlineActions,
  incomingRequestsAction,
  outgoingRequestsAction,
} from "./../Store/store";
import { useState } from "react";
import { useRef } from "react";

function GlobalEventHandlers(props) {
  let socket = props.socket;
  let dispatch = useDispatch();
  let [vcPeer, setVcPeer] = useState(props.vcPeer);
  let [VOICESTREAM, setVoiceStream] = useState(props.VOICESTREAM);
  let currentMainCont = useSelector((state) => state.currentMainCont);
  let USERDATA = useSelector((state) => state.USERDATA);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);
  let controlsOptions = useSelector((state) => state.controls);

  let IOdevices = useSelector((state) => state.IOdevices);

  let currentMainContRef = useRef();
  let VOICESTREAMref = useRef();
  let currentCallStatusRef = useRef();
  let USERDATAref = useRef();

  let call = currentCallStatus.callObj;

  useEffect(() => {
    currentMainContRef.current = currentMainCont;
    currentCallStatusRef.current = currentCallStatus;
    VOICESTREAMref.current = VOICESTREAM;
    USERDATAref.current = USERDATA;
  }, [currentCallStatus, VOICESTREAM, currentMainCont, USERDATA]);

  useEffect(() => {
    if (!VOICESTREAMref.current) return;
    let audio = VOICESTREAMref.current.getAudioTracks()[0];
    audio.enabled = !controlsOptions.mute;
  }, [controlsOptions.mute]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          deviceId: IOdevices.input,
        },
      })
      .then((stream) => {
        setVoiceStream(stream);
      });
  }, [IOdevices.input]);

  useEffect(() => {
    vcPeer.on("call", (incoming) => {
      incoming.answer(VOICESTREAMref.current);

      call = incoming;
      call.on("stream", (userVideoStream) => {
        if (currentCallStatusRef.current.status) {
        } else {
          // console.log("My Stream : ", VOICESTREAM);
          // console.log("User Stream : ", userVideoStream);
          dispatch(
            currentCallStatusAction.loadObj({
              status: true,
              callObj: call,
              // currentCallCont: currentMainContRef.current.id,
              currentCallCont: currentCallStatusRef.current.currentCallCont,
              callList: [
                {
                  id: USERDATA.id,
                  stream: VOICESTREAMref.current,
                },
                { id: "test", stream: userVideoStream },
              ],
              waiting: {
                status: false,
                name: "",
                room: "",
              },
            })
          );

          socket.emit(
            "getCallData",
            currentCallStatusRef.current.currentCallCont
          );
        }
      });
    });

    socket.on("joined-call", (data) => {
      // if (data.room === currentMainContRef.current.id) {
      call = vcPeer.call(data.id, VOICESTREAMref.current);

      dispatch(
        currentCallStatusAction.loadObj({
          status: false,
          callObj: null,
          currentCallCont: data.room,
          callList: [],
          waiting: {
            status: true,
            name: data.name,
            room: data.room,
          },
        })
      );

      call.on("stream", (userVideoStream) => {
        if (currentCallStatusRef.current.status) {
        } else {
          dispatch(
            currentCallStatusAction.loadObj({
              status: true,
              callObj: call,
              currentCallCont: currentMainContRef.current.id,
              callList: [
                {
                  id: USERDATA.id,
                  stream: VOICESTREAMref.current,
                },
                {
                  id: data.id,
                  name: data.name,
                  image: data.image,
                  stream: userVideoStream,
                },
              ],
              waiting: {
                status: false,
                name: "",
                room: "",
              },
            })
          );
        }
      });
      // }
    });

    socket.on("receive-message_dm", (data) => {
      if (data.type.includes("reply")) {
        dispatch(
          dmMessagesAction.addMessage({
            objId: data.objId,
            dmId: data.room,
            type: data.type,
            message: data.message,
            from: data.from,
            name: data.name,
            image: data.image,
            createdAt: data.createdAt,
            replyTo: data.replyTo,
            replyMessage: data.replyMessage,
          })
        );
      } else {
        dispatch(
          dmMessagesAction.addMessage({
            objId: data.objId,
            dmId: data.room,
            type: data.type,
            message: data.message,
            from: data.from,
            name: data.name,
            image: data.image,
            createdAt: data.createdAt,
          })
        );
      }
    });

    socket.on("save-dm-message", (data) => {
      if (data.status === "OK") {
        let final = data.final;
        let reply = data.reply;
        data = data.data;
        final.objId = data._id;
        final.createdAt = data.createdAt;
        socket.emit("send-message_dm", final);
        dispatch(
          dmMessagesAction.addMessage({
            objId: final.objId,
            type: final.type,
            replyTo: reply.replyingTo,
            replyMessage: reply.messageId,
            dmId: data.dmId,
            message: final.message,
            from: USERDATA.id,
            name: USERDATA.name,
            image: USERDATA.image,
            createdAt: final.createdAt,
          })
        );
      }
    });

    socket.on("edit_message-dm", (data) => {
      dispatch(dmMessagesAction.updateMessage(data));
    });

    socket.on("getCallData", (room) => {
      if (currentCallStatusRef.current.currentCallCont === room) {
        socket.emit("receiveCallData", {
          room,
          name: USERDATAref.current.name,
          id: USERDATAref.current.id,
          image: USERDATAref.current.image,
        });
      }
    });

    socket.on("receiveCallData", (data) => {
      dispatch(
        currentCallStatusAction.updateUser({
          id: data.id,
          name: data.name,
          image: data.image,
        })
      );
    });

    socket.on("end-call", (room) => {
      if (currentCallStatusRef.current.currentCallCont === room) {
        if (currentCallStatusRef.current.callObj) {
          currentCallStatusRef.current.callObj.close();
        }

        dispatch(currentCallStatusAction.closeCall());
      }
    });

    socket.on("user-offline", (id) => {
      dispatch(onlineActions.setOffline(id));
    });

    socket.on("friend-request-verdict", (data) => {
      if (data.to === USERDATA.id) {
        //OUTOGOING ACCEPTED
        if (data.type === "ACCEPTED") {
          dispatch(outgoingRequestsAction.removeRequest(data.from));
        } else if (data.type === "INCOMING_REJECTED") {
          dispatch(outgoingRequestsAction.removeRequest(data.from));
        } else if (data.type === "OUTGOING_REJECTED") {
          dispatch(incomingRequestsAction.removeRequest(data.from));
        }
      }
    });

    socket.on("friend-request", (data) => {
      if (data.to === USERDATA.id) {
        dispatch(incomingRequestsAction.incoming(data.from));
      }
    });
  }, []);

  useEffect(() => {
    if (vcPeer) {
      vcPeer.on("connection", (conn) => {
        conn.on("data", (data) => {
          if (data.type === "checkOnline") {
            dispatch(onlineActions.setOnline(data.id));
            conn.send({
              type: "yesOnline",
              id: USERDATA.id,
            });
          }
        });
      });
    }
  }, [vcPeer]);

  return <div className="GlobalEventHandlers"></div>;
}

export default GlobalEventHandlers;
