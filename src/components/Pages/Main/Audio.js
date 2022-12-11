import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

function Audio(props) {
  const audioRef = useRef();
  useEffect(() => {
    audioRef.current.srcObject = props.stream;
    audioRef.current.addEventListener("loadedmetadata", () => {
      audioRef.current.play();
      if (props.deafen) {
        audioRef.current.pause();
      }
    });
  });
  return <video ref={audioRef} style={{ display: "none" }}></video>;
}

export default Audio;
