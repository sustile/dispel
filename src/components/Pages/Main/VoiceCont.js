import React from "react";
import { useSelector } from "react-redux";
import Audio from "./Audio";

function VoiceCont(props) {
  let currentCallStatus = useSelector((state) => state.currentCallStatus);
  const USERDATA = useSelector((state) => state.USERDATA);
  let controlsOptions = useSelector((state) => state.controls);

  return (
    <div className="VoiceCont">
      {currentCallStatus.callList.map((el) => {
        if (el.id !== USERDATA.id) {
          return <Audio stream={el.stream} deafen={controlsOptions.deafen} />;
        }
      })}
    </div>
  );
}

export default VoiceCont;
