import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AllDmsActions, CurrentMainContActions } from "../../Store/store";

import useStandaloneOnlineHandler from "../useStandaloneOnlineHandler";

function AllFriends(props) {
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  let socket = props.socket;
  let vcPeer = props.vcPeer;
  let [renderData, setRenderData] = useState([]);
  let [noData, setNoData] = useState(false);

  useEffect(() => {
    (async () => {
      let data = await axios.get(`${CONSTANTS.ip}/api/getAllFriends`);
      if (data.data.status === "ok") {
        if (data.data.friends.length === 0) {
          setNoData(true);
        }
        setRenderData(data.data.friends);
      }
    })();
  }, []);

  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>All Friends</h2>
      </div>
      <div className="Friends-MasterCont_RenderCont">
        {renderData.map((el) => {
          return <Friends_User data={el} socket={socket} vcPeer={vcPeer} />;
        })}
        {noData && renderData.length === 0 && (
          <h2 className="NoData">
            You have no Friends <br />
            Head Over to "<span>Add Friends</span>" to start chatting
          </h2>
        )}
      </div>
    </div>
  );
}

function Friends_User(props) {
  let userId = props.data;
  let socket = props.socket;
  let dispatch = useDispatch();
  const dmsData = useSelector((state) => state.allDms);

  let [renderData, setRenderData] = useState({
    name: "",
    image: "default.png",
  });
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  useEffect(() => {
    (async () => {
      let user = await axios.post(`${CONSTANTS.ip}/api/getUserBasicData`, {
        id: userId,
      });

      if (user.data.status === "ok") {
        setRenderData({
          name: user.data.user.name,
          image: user.data.user.image,
        });
      }
    })();
  }, []);

  useStandaloneOnlineHandler(props.vcPeer, userId);

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
              <p>{userId}</p>
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

export default AllFriends;
