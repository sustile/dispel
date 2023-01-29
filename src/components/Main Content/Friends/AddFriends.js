import React from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { outgoingRequestsAction, notificationsAction } from "../../Store/store";

function AddFriends(props) {
  let inputRef = useRef();
  let socket = props.socket;
  let dispatch = useDispatch();
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  const USERDATA = useSelector((state) => state.USERDATA);
  async function submitHandler(e) {
    e.preventDefault();
    let value = String(inputRef.current.value).trim();
    if (!value) return;

    let data2 = await axios.get(`${CONSTANTS.ip}/api/getAllFriends`);

    if (data2.data.status === "ok") {
      if (data2.data.friends.includes(value)) {
        dispatch(
          notificationsAction.setNotification({
            type: "error",
            message: `User is Already in Your Friends List`,
          })
        );
        return;
      }
    } else {
      dispatch(
        notificationsAction.setNotification({
          type: "error",
          message: `Something Went Wrong`,
        })
      );
      return;
    }

    let data = await axios.post(`${CONSTANTS.ip}/api/addFriends`, {
      id: value,
    });
    if (data.data.status === "ok") {
      // successfully sent request
      inputRef.current.value = "";
      socket.emit("standalone-friend-request", {
        from: USERDATA.id,
        to: value,
      });
      dispatch(outgoingRequestsAction.outgoing(value));
      dispatch(
        notificationsAction.setNotification({
          type: "ok",
          message: `Request Sent Successfully`,
        })
      );
    }
  }

  return (
    <div className="Friends-OnlineFriends_Master Friends-MasterCont">
      <div className="Friends-topBar">
        <h2>Add Friends</h2>
      </div>
      <div className="Friends-MasterCont_AddFriends">
        <form onSubmit={submitHandler}>
          <label htmlFor="idInput">
            Enter the ID of the Person that You want to Send a Request to
          </label>
          <motion.input
            type="text"
            id="idInput"
            ref={inputRef}
            placeholder="Enter ID"
            required
            whileFocus={{ boxShadow: "0 0 0 0.5rem var(--primary-red)" }}
          />
          <motion.button
            whileHover={{
              scale: 1.2,
              transition: {
                duration: 0.5,
                type: "spring",
              },
            }}
            whileTap={{
              scale: 0.9,
              transition: {
                duration: 0.1,
                type: "spring",
                damping: 25,
                stiffness: 500,
              },
            }}
            type="submit"
          >
            <i class="ph-check-bold"></i>
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default AddFriends;
