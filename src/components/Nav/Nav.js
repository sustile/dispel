import { AnimatePresence } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";
import CallCont from "../Call Cont/CallCont";
import Controls from "../Controls/Controls";
import Sidebar from "../Sidebar/Sidebar";
import "./Nav.css";

function Nav(props) {
  const userData = useSelector((state) => state.USERDATA);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);

  return (
    <div className="Nav">
      <div className="Nav_Left">
        <Sidebar vcPeer={props.vcPeer} />
        <Controls />
        <div className="userDetails">
          <img src={`/Images/${userData.image}`} />
          <div className="userDetails_Details">
            <span>{userData.name}</span>
            <p>{userData.id}</p>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {(currentCallStatus.status || currentCallStatus.waiting.status) && (
          <CallCont socket={props.socket} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Nav;
