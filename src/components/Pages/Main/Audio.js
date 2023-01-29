import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

function Audio(props) {
  const audioRef = useRef();
  let IOdevices = props.IOdevices;
  useEffect(() => {
    audioRef.current.srcObject = props.stream;
    audioRef.current.addEventListener("loadedmetadata", () => {
      audioRef.current.setSinkId(IOdevices.output);
      audioRef.current.volume = IOdevices.outputVolume;
      audioRef.current.play();
      if (props.deafen) {
        audioRef.current.pause();
      }
    });
  });

  return <video ref={audioRef} style={{ display: "none" }}></video>;
}

export default Audio;
