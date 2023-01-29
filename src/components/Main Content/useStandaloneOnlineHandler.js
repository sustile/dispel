import { useSelector, useDispatch } from "react-redux";
import { onlineActions } from "../Store/store";
import React, { useState } from "react";

export default async function useStandaloneOnlineHandler(vcPeer, id) {
  let dispatch = useDispatch();
  let onlineStatus = useSelector((state) => state.online);
  let USERDATA = useSelector((state) => state.USERDATA);
  let [check, setCheck] = useState(false);
  if (!onlineStatus.includes(id) && vcPeer) {
    let conn = vcPeer.connect(id);
    conn.on("open", () => {
      setCheck(true);
      conn.send({
        type: "checkOnline",
        id: USERDATA.id,
      });
      conn.on("data", (data) => {
        if (data.type === "yesOnline") {
          dispatch(onlineActions.setOnline(id));
          conn.close();
        }
      });
    });

    // setTimeout(() => {
    //   if (!check) {
    //     console.log("yes");
    //     dispatch(onlineActions.setOffline(id));
    //   }
    // }, 10 * 1000);
  }
}
