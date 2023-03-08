import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallCont from "../Call Cont/CallCont";
import Controls from "../Controls/Controls";
import Sidebar from "../Sidebar/Sidebar";
import "./Nav.css";
import { ContextMenuActions } from "../Store/store";
import generateUniqueId from "generate-unique-id";
import { motion, AnimatePresence } from "framer-motion";
function Nav(props) {
  const userData = useSelector((state) => state.USERDATA);
  let currentCallStatus = useSelector((state) => state.currentCallStatus);
  const [profileId, setProfileId] = useState(generateUniqueId());
  const dispatch = useDispatch();
  const ContextMenu = useSelector((state) => state.contextMenu);

  function ClickHandler() {
    dispatch(ContextMenuActions.loadMenu(profileId));
  }

  return (
    <div className="Nav">
      <div className="Nav_Left">
        <Sidebar vcPeer={props.vcPeer} />
        <Controls />
        <div className="userDetails">
          <img
            src={`/Images/${userData.image}`}
            className="userDataTrigger"
            onClick={ClickHandler}
          />
          <div className="userDetails_Details">
            <span className="userDataTrigger" onClick={ClickHandler}>
              {userData.name}
            </span>
            <p>{userData.id}</p>
          </div>
          <AnimatePresence initial={false} exitBeforeEnter={true}>
            {ContextMenu.id === profileId && (
              <UserProfilePopup userProfileData={userData} />
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {(currentCallStatus.status || currentCallStatus.waiting.status) && (
          <CallCont socket={props.socket} />
        )}
      </AnimatePresence>
    </div>
  );
}

function UserProfilePopup({ userProfileData }) {
  return (
    <motion.div
      className="AccountCard"
      onClick={(e) => {
        e.stopPropagation();
        return;
      }}
      initial={{
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 0.2,
        },
      }}
      exit={{
        scale: 0.5,
        opacity: 0,
        transition: {
          type: "spring",
          duration: 0.2,
        },
      }}
    >
      <motion.div className="DirectMessages_UserProfileContext">
        <div className="ImgCont">
          <div className="coverImageCont">
            {userProfileData.coverImage !== "undefined" ? (
              <img
                src={`/Images/${userProfileData.coverImage}`}
                className="coverImage"
              />
            ) : (
              <div className="NOCoverImage"></div>
            )}
          </div>
          <div className="userProfileImageCont">
            <img
              src={`/Images/${userProfileData.image}`}
              className="userProfileImage"
            />
          </div>
        </div>
        <div className="userProfileData">
          <div className="nameCont">
            <span>{userProfileData.name}</span>
          </div>
          <p>{userProfileData.id}</p>
        </div>
        <div className="userProfileAboutMe">
          <div className="aboutMeCont">
            <span>About Me</span>
          </div>
          <p>
            {userProfileData.aboutMe === "undefined" ? (
              <span>* Let the World Know about You *</span>
            ) : (
              userProfileData.aboutMe
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Nav;
