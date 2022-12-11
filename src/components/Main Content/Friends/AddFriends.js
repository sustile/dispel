import React from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function AddFriends(props) {
  let inputRef = useRef();
  const CONSTANTS = useSelector((state) => state.CONSTANTS);
  async function submitHandler(e) {
    e.preventDefault();
    let value = String(inputRef.current.value).trim();
    if (!value) return;

    let data = await axios.post(`${CONSTANTS.ip}/api/addFriends`, {
      id: value,
    });
    if (data.data.status === "ok") {
      // successfully sent request
      inputRef.current.value = "";
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
