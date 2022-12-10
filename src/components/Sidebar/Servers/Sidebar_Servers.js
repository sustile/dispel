import React from "react";
import "./Sidebar_Servers.css";
import Sidebar_Servers_server from "./Sidebar_Servers_server";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function Sidebar_Servers(props) {
  const serverData = useSelector((state) => state.allServers);
  return (
    <div className="Servers_Sidebar">
      <h2>Servers</h2>
      <motion.div className="Servers_Sidebar_MainCont">
        {serverData.map((el) => {
          return (
            <Sidebar_Servers_server
              key={el.serverId}
              data={el}
              closeSidebar={props.closeSidebar}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export default Sidebar_Servers;
