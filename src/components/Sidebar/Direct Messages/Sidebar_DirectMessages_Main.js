import React from "react";
import Sidebar_DirectMessages_User from "./Sidebar_DirectMessages_User";
import { useSelector } from "react-redux";

function Sidebar_DirectMessages_Main(props) {
  const dmsData = useSelector((state) => state.allDms);

  return (
    <div className="DirectMessages_Sidebar_Main">
      <h2>Direct Messages</h2>
      {dmsData.map((el) => {
        return (
          <Sidebar_DirectMessages_User
            key={el.dmId}
            data={el}
            vcPeer={props.vcPeer}
            closeSidebar={props.closeSidebar}
          />
        );
      })}
      {dmsData.length === 0 && (
        <p className="addSomeFriends">Add some Friends to Get Chatting</p>
      )}
    </div>
  );
}

export default Sidebar_DirectMessages_Main;
