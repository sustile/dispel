import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  incomingRequestsAction,
  outgoingRequestsAction,
  notificationsAction,
} from "./../../Store/store";

function PendingRequests(props) {
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  let incoming = useSelector((state) => state.incomingRequests);
  let outgoing = useSelector((state) => state.outgoingRequests);
  let socket = props.socket;
  // let [renderDataIncoming, setRenderDataIncoming] = useState(incoming);
  // let [renderDataOutgoing, setRenderDataOutgoing] = useState(outgoing);
  // let [changeTrigger, setChangeTrigger] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     let data = await axios.get(`${CONSTANTS.ip}/api/getAllPendingRequests`);
  //     if (data.data.status === "ok") {
  //       setRenderDataIncoming((prev) => [...prev, ...data.data.incoming]);
  //       setRenderDataOutgoing((prev) => [...prev, ...data.data.outgoing]);
  //     }
  //   })();
  // }, [changeTrigger]);

  // function changeTriggerFunction() {
  //   setChangeTrigger((el) => !el);
  // }

  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>Pending Requests</h2>
      </div>
      <div className="Friends-MasterCont_RenderCont">
        {incoming.map((el) => {
          return (
            <Friends_User
              data={el}
              socket={socket}
              type={"Incoming"}
              // change={changeTriggerFunction}
            />
          );
        })}
        {outgoing.map((el) => {
          return (
            <Friends_User
              data={el}
              socket={socket}
              type={"Outgoing"}
              // change={changeTriggerFunction}
            />
          );
        })}
        {incoming.length === 0 && outgoing.length == 0 && (
          <h2 className="NoData">You have no Pending Friend Requests</h2>
        )}
      </div>
    </div>
  );
}

function Friends_User(props) {
  let userId = props.data;
  let type = props.type;
  // let setChangeTrigger = props.change;
  let [renderData, setRenderData] = useState({
    name: "",
    image: "",
  });
  let socket = props.socket;
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const dispatch = useDispatch();
  let USERDATA = useSelector((state) => state.USERDATA);

  async function acceptHandler() {
    let result = await axios.post(`${CONSTANTS.ip}/api/acceptRequest`, {
      id: userId,
    });
    if (result.data.status === "ok") {
      // success popup
      // setChangeTrigger();
      dispatch(incomingRequestsAction.removeRequest(userId));
      socket.emit("standalone-friend-request-verdict", {
        to: userId,
        from: USERDATA.id,
        type: "ACCEPTED",
      });
      dispatch(
        notificationsAction.setNotification({
          type: "ok",
          message: `You Accepted ${renderData.name} Friend Request`,
        })
      );
    }
  }

  async function rejectHandler() {
    let result = await axios.post(`${CONSTANTS.ip}/api/rejectRequest`, {
      id: userId,
      type: String(type).toLowerCase(),
    });
    if (result.data.status === "ok") {
      // success popup
      // setChangeTrigger();
      if (type === "Incoming") {
        dispatch(incomingRequestsAction.removeRequest(userId));
        socket.emit("standalone-friend-request-verdict", {
          to: userId,
          from: USERDATA.id,
          type: "INCOMING_REJECTED",
        });
      } else {
        dispatch(outgoingRequestsAction.removeRequest(userId));
        socket.emit("standalone-friend-request-verdict", {
          to: userId,
          from: USERDATA.id,
          type: "OUTGOING_REJECTED",
        });
      }
    }
  }

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

  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgb(31, 31, 31)",
        transition: {
          type: "spring",
          duration: 0.3,
        },
      }}
      className="Friends-MasterCont_RenderCont-pending"
    >
      <p className="RequestType">{type} Request</p>
      <div className="Request">
        <div className="RequestDetails">
          <img src={`/Images/${renderData.image}`} />
          <div className="userDetails">
            <span>{renderData.name}</span>
            <p>{userId}</p>
          </div>
        </div>

        <div className="RequestControls">
          {type === "Incoming" && (
            <motion.i
              className="ph-check-bold"
              onClick={acceptHandler}
              whileHover={{
                scale: 1.2,
                transition: {
                  duration: 0.5,
                  type: "spring",
                },
              }}
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
          )}

          <motion.i
            className="ph-x-bold"
            onClick={rejectHandler}
            whileHover={{
              scale: 1.2,
              transition: {
                duration: 0.5,
                type: "spring",
              },
            }}
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
        </div>
      </div>
    </motion.div>
  );
}

export default PendingRequests;
