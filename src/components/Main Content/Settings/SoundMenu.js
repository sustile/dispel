import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { IOdevicesActions } from "./../../Store/store";
import { useRef } from "react";

function SoundMenu(props) {
  const [outputDevices, setOutputDevices] = useState([]);
  const [inputDevices, setInputDevices] = useState([]);
  const [showOutput, setShowOutput] = useState(false);
  const [showInput, setShowInput] = useState(false);
  let IOdevices = useSelector((state) => state.IOdevices);
  let dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let alldevices = await navigator.mediaDevices.enumerateDevices();
      setOutputDevices(alldevices.filter((el) => el.kind.includes("output")));
      setInputDevices(
        alldevices.filter((el) => el.kind.includes("audioinput"))
      );
    })();
  }, []);
  return (
    <div className="SoundSettings-MasterCont">
      <div className="Friends-topBar">
        <h2>Sound</h2>
      </div>
      <div className="SoundSettings-MasterCont_RenderCont">
        <div className="OutputDevicesMain">
          <h2 className="header">Change Output Device</h2>

          <div className="OutputOptionContent">
            <div
              className="OutputOptionDisplay"
              onClick={() => {
                setShowOutput((prev) => !prev);
                setShowInput(false);
              }}
            >
              <h2>{IOdevices.outputDeviceName}</h2>
              <i
                class="ph-caret-down-bold"
                style={
                  showOutput
                    ? { transform: "rotate(180deg)" }
                    : { transform: "rotate(0)" }
                }
              ></i>
              <AnimatePresence initial={false} exitBeforeEnter={true}>
                {showOutput && (
                  <motion.div
                    className="outputListOptions"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                  >
                    {outputDevices.map((el) => (
                      <OutputOptions value={el.deviceId} name={el.label} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <h2 className="header">Change Output Volume</h2>
          <div className="SliderCont">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={IOdevices.outputVolume * 100}
              class="slider"
              onChange={(e) => {
                dispatch(
                  IOdevicesActions.changeOutputVolume(
                    Number(e.target.value) / 100
                  )
                );
              }}
            />
            {/* <label>{Math.round(IOdevices.outputVolume * 100)}</label> */}
          </div>
        </div>

        <div className="inputDeviceMain">
          <h2 className="header">Change Input Device</h2>

          <div className="InputOptionContent">
            <div
              className="InputOptionDisplay"
              onClick={() => {
                setShowInput((prev) => !prev);
                setShowOutput(false);
              }}
            >
              <h2>{IOdevices.inputDeviceName}</h2>
              <i
                class="ph-caret-down-bold"
                style={
                  showInput
                    ? { transform: "rotate(180deg)" }
                    : { transform: "rotate(0)" }
                }
              ></i>
              <AnimatePresence initial={false} exitBeforeEnter={true}>
                {showInput && (
                  <motion.div
                    className="outputListOptions"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                  >
                    {inputDevices.map((el) => (
                      <InputOptions value={el.deviceId} name={el.label} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <h2 className="header">Change Input Volume</h2>
          <div className="SliderCont">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={IOdevices.inputVolume * 100}
              class="slider"
              onChange={(e) => {
                dispatch(
                  IOdevicesActions.changeInputVolume(
                    Number(e.target.value) / 100
                  )
                );
              }}
            />
            {/* <label>{Math.round(IOdevices.outputVolume * 100)}</label> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputOptions(props) {
  let dispatch = useDispatch();
  let IOdevices = useSelector((state) => state.IOdevices);

  return (
    <motion.span
      whileHover={{
        backgroundColor: "rgb(22, 22, 22)",
        scale: 1.03,
        transition: {
          duration: 0.1,
        },
      }}
      whileTap={{
        scale: 0.95,
      }}
      onClick={() => {
        if (IOdevices.output !== props.value) {
          dispatch(
            IOdevicesActions.changeOutput({
              output: props.value,
              outputDeviceName: props.name,
            })
          );
        }
      }}
    >
      {props.name}
    </motion.span>
  );
}

function InputOptions(props) {
  let dispatch = useDispatch();
  let IOdevices = useSelector((state) => state.IOdevices);

  return (
    <motion.span
      whileHover={{
        backgroundColor: "rgb(22, 22, 22)",
        scale: 1.03,
        transition: {
          duration: 0.1,
        },
      }}
      whileTap={{
        scale: 0.95,
      }}
      onClick={() => {
        if (IOdevices.input !== props.value) {
          dispatch(
            IOdevicesActions.changeInput({
              input: props.value,
              inputDeviceName: props.name,
            })
          );
        }
      }}
    >
      {props.name}
    </motion.span>
  );
}

export default SoundMenu;
