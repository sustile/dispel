import React, { useEffect } from "react";
import DirectMessages from "../../Main Content/Direct Messages/DirectMessages";
import ServerMessages from "../../Main Content/Servers/ServerMessages";
import VoiceCont from "./VoiceCont";
import Nav from "../../Nav/Nav";
import Home from "../../Main Content/Home/Home";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { io } from "./../../../../node_modules/socket.io/client-dist/socket.io";

import Peer from "peerjs";

import {
  UserDataActions,
  AllDmsActions,
  AllServerActions,
} from "./../../Store/store";
import { useState } from "react";
import GlobalEventHandlers from "../../Main Content/GlobalEventHandlers";
import CallPopup from "../../Call Popup/CallPopup";

function Main(props) {
  const dispatch = useDispatch();
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  let userData = useSelector((state) => state.USERDATA);
  let dmData = useSelector((state) => state.allDms);
  let serverData = useSelector((state) => state.allServers);
  const currentMainCont = useSelector((state) => state.currentMainCont);

  let [VOICESTREAM, SETVOICESTREAM] = useState(null);
  let [socket, joinSocket] = useState(null);
  let [vcPeer, setVcPeer] = useState(null);

  useEffect(() => {
    (async () => {
      // let lol = await axios.post(`${CONSTANTS.ip}/api/addNewDm`, {
      //   person2: "638ca9b3149d344882dd6f68",
      // });

      // navigator.mediaDevices
      //   .getUserMedia({
      //     video: false,
      //     audio: {
      //       noiseSuppression: true,
      //       echoCancellation: true,
      //     },
      //   })
      //   .then((stream) => {
      //     SETVOICESTREAM(stream);
      //   });

      let data = await axios.get(`${CONSTANTS.ip}/api/getBasicData`);
      if (data.data.status === "ok") {
        dispatch(UserDataActions.loadUserData(data.data.user));
      }

      let dmsData = await axios.get(`${CONSTANTS.ip}/api/getAllDms`);
      if (dmsData.data.status === "ok") {
        let final = [];

        for (let el of dmsData.data.dms) {
          let dm = await axios.post(`${CONSTANTS.ip}/api/getDm`, {
            id: el,
          });
          if (dm.data.status === "ok") {
            final.push(dm.data.data);
          }
        }
        dispatch(AllDmsActions.loadDMs(final));
      }

      let houseData = await axios.get(`${CONSTANTS.ip}/api/getAllHouse`);
      if (houseData.data.status === "ok") {
        dispatch(AllServerActions.loadServers(houseData.data.houses));
      }

      let x = io("http://localhost:5000", { transports: ["websocket"] });

      dmsData.data.dms.forEach((el) => x.emit("join-room", el));

      joinSocket(x);

      setVcPeer(
        new Peer(data.data.user.id, {
          host: "localhost",
          path: "/vcPeer",
          port: "4000",
        })
      );
    })();
  }, []);

  return (
    <div className="Dispel-pages">
      <Nav socket={socket} />
      {currentMainCont.value === "dmCont" ? (
        <DirectMessages
          data={currentMainCont}
          socket={socket}
          vcPeer={vcPeer}
        />
      ) : (
        ""
      )}
      {currentMainCont.value === "serverCont" ? (
        <ServerMessages data={currentMainCont} />
      ) : (
        ""
      )}
      <Home />
      {vcPeer && (
        <GlobalEventHandlers
          socket={socket}
          vcPeer={vcPeer}
          VOICESTREAM={VOICESTREAM}
        />
      )}
      {vcPeer && (
        <React.Fragment>
          <VoiceCont
            VOICESTREAM={VOICESTREAM}
            vcPeer={vcPeer}
            socket={socket}
          />
          <CallPopup vcPeer={vcPeer} socket={socket} />
        </React.Fragment>
      )}
    </div>
  );
}

export default Main;
