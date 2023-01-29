import React from "react";
import Sidebar_DirectMessages_Main from "./Sidebar_DirectMessages_Main";
import "./Sidebar_DirectMessages.css";

function Sidebar_DirectMessages(props) {
  return (
    <div className="DirectMessages_Sidebar">
      <Sidebar_DirectMessages_Main
        closeSidebar={props.closeSidebar}
        vcPeer={props.vcPeer}
      />
    </div>
  );
}

export default Sidebar_DirectMessages;
