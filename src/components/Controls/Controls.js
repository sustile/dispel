import React from "react";
import Deafen from "./Deafen";
import Mute from "./Mute";
import "./Controls.css";
import SettingsButton from "./SettingsButton";

function Controls() {
  return (
    <div className="ControlsMainCont">
      <div className="MediaControlsCont">
        <Mute />
        <Deafen />
      </div>
      <SettingsButton />
    </div>
  );
}

export default Controls;
