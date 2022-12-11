import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";

function PendingRequests(props) {
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  let [renderDataIncoming, setRenderDataIncoming] = useState([]);
  let [renderDataOutgoing, setRenderDataOutgoing] = useState([]);
  let [changeTrigger, setChangeTrigger] = useState(false);

  useEffect(() => {
    (async () => {
      let data = await axios.get(`${CONSTANTS.ip}/api/getAllPendingRequests`);
      if (data.data.status === "ok") {
        setRenderDataIncoming(data.data.incoming);
        setRenderDataOutgoing(data.data.outgoing);
      }
    })();
  }, [changeTrigger]);

  function changeTriggerFunction() {
    setChangeTrigger((el) => !el);
  }

  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>Pending Requests</h2>
      </div>
      <div className="Friends-MasterCont_RenderCont">
        {renderDataIncoming.map((el) => {
          return (
            <Friends_User
              data={el}
              type={"Incoming"}
              change={changeTriggerFunction}
            />
          );
        })}
        {renderDataOutgoing.map((el) => {
          return (
            <Friends_User
              data={el}
              type={"Outgoing"}
              change={changeTriggerFunction}
            />
          );
        })}
        {renderDataIncoming.length === 0 && renderDataOutgoing.length == 0 && (
          <h2 className="NoData">You have no Pending Friend Requests</h2>
        )}
      </div>
    </div>
  );
}

function Friends_User(props) {
  let userId = props.data;
  let type = props.type;
  let setChangeTrigger = props.change;
  let [renderData, setRenderData] = useState({
    name: "",
    image: "",
  });
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  async function acceptHandler() {
    let result = await axios.post(`${CONSTANTS.ip}/api/acceptRequest`, {
      id: userId,
    });
    if (result.data.status === "ok") {
      // success popup
      setChangeTrigger();
    }
  }

  async function rejectHandler() {
    let result = await axios.post(`${CONSTANTS.ip}/api/rejectRequest`, {
      id: userId,
      type: String(type).toLowerCase(),
    });
    if (result.data.status === "ok") {
      // success popup
      setChangeTrigger();
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
