import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AllDmsActions } from "../../Store/store";

function AllFriends(props) {
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  let socket = props.socket;
  let [renderData, setRenderData] = useState([]);

  useEffect(() => {
    (async () => {
      let data = await axios.get(`${CONSTANTS.ip}/api/getAllFriends`);
      if (data.data.status === "ok") {
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
          return <Friends_User data={el} socket={socket} />;
        })}
        {renderData.length === 0 && (
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

  let [renderData, setRenderData] = useState({
    name: "",
    image: "",
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

  async function clickHandler() {
    let lol = await axios.post(`${CONSTANTS.ip}/api/addNewDm`, {
      person2: userId,
    });
    if (lol.data.status === "ok") {
      // successfully create dm
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

        dmsData.data.dms.forEach((el) => socket.emit("join-room", el));
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
    </motion.div>
  );
}

export default AllFriends;
