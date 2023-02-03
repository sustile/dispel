import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import useStandaloneOnlineHandler from "../useStandaloneOnlineHandler";
import { useSelector, useDispatch } from "react-redux";
import {
  onlineActions,
  CurrentMainContActions,
  AllDmsActions,
} from "./../../Store/store";
import axios from "axios";

function OnlineFriends(props) {
  let vcPeer = props.vcPeer;
  let socket = props.socket;
  let onlineList = useSelector((state) => state.online);
  let dispatch = useDispatch();
  let CONSTANTS = useSelector((state) => state.CONSTANTS);

  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>Online</h2>
      </div>
      <div className="Friends-MasterCont_RenderCont">
        {onlineList.map((el) => {
          return <Friends_User id={el} socket={socket} />;
        })}
      </div>
    </div>
  );
}

function Friends_User(props) {
  let [renderData, setRenderData] = useState({
    name: "",
    image: "default.png",
  });
  let dispatch = useDispatch();
  let userId = props.id;
  let socket = props.socket;
  let CONSTANTS = useSelector((state) => state.CONSTANTS);
  const dmsData = useSelector((state) => state.allDms);
  useEffect(() => {
    (async () => {
      let user = await axios.post(`${CONSTANTS.ip}/api/getUserBasicData`, {
        id: props.id,
      });

      if (user.data.status === "ok") {
        setRenderData({
          name: user.data.user.name,
          image: user.data.user.image,
        });
      }
    })();
  }, []);

  async function clickHandler() {
    let x = dmsData.filter((el) => el.toId === userId);
    if (x.length !== 0) {
      // OPEN DM
      x = x[0];
      dispatch(
        CurrentMainContActions.changeCont({
          value: "dmCont",
          id: x.dmId,
          name: x.to,
        })
      );
      return;
    }

    let lol = await axios.post(`${CONSTANTS.ip}/api/addNewDm`, {
      person2: userId,
    });
    if (lol.data.status === "ok") {
      let dm = await axios.post(`${CONSTANTS.ip}/api/getDm`, {
        id: lol.data.dmId,
      });
      if (dm.data.status === "ok") {
        dispatch(AllDmsActions.addDm(dm.data.data));
        socket.emit("join-room", lol.data.dmId);
        dispatch(
          CurrentMainContActions.changeCont({
            value: "dmCont",
            id: lol.data.dmId,
            name: dm.data.data.to,
          })
        );
      }
    }
  }

  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgb(31, 31, 31)",
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      className="Friends-MasterCont_RenderCont-friend"
    >
      {renderData.name && (
        <React.Fragment>
          <div className="detailsCont">
            <img src={`/Images/${renderData.image}`} />
            <div className="userDetails">
              <span>{renderData.name}</span>
              <p>{props.id}</p>
            </div>
          </div>
          <motion.i
            className="ph-chats-bold"
            whileHover={{
              scale: 1.2,
              transition: {
                duration: 0.5,
                type: "spring",
              },
            }}
            onClick={clickHandler}
            whileTap={{
              scale: 0.9,
              transition: {
                duration: 0.1,
                type: "spring",
                damping: 25,
                stiffness: 500,
              },
            }}
          ></motion.i>
        </React.Fragment>
      )}
    </motion.div>
  );
}

export default OnlineFriends;
