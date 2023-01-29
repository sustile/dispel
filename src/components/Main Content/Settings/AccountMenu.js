import React, { useRef, useState, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Form } from "react-router-dom";
import { UserDataActions, notificationsAction } from "../../Store/store";

function changeReducer(state, action) {
  if (action.type === "NAME_CHANGE") {
    if (action.data !== action.userName && action.data !== "") {
      return { ...state, change: true, name: action.data, validName: true };
    } else {
      return {
        ...state,
        change: state.validAbout || state.validDp || state.validCover,
        name: action.data,
        validName: false,
      };
    }
  } else if (action.type === "ABOUT_CHANGE") {
    if (action.data !== action.about && action.data !== "") {
      return {
        ...state,
        change: true,
        aboutMe: action.data,
        validAbout: true,
      };
    } else {
      return {
        ...state,
        change: state.validName || state.validDp || state.validCover,
        aboutMe: action.data,
        validAbout: false,
      };
    }
  } else if (action.type === "DP_CHANGE") {
    if (action.data !== "") {
      return {
        ...state,
        change: true,
        dpImg: action.data,
        validDp: true,
      };
    } else {
      return {
        ...state,
        change: state.validName || state.validAbout || state.validCover,
        dpImg: action.data,
        validDp: false,
      };
    }
  } else if (action.type === "COVER_CHANGE") {
    if (action.data !== "") {
      return {
        ...state,
        change: true,
        coverImg: action.data,
        validCover: true,
      };
    } else {
      return {
        ...state,
        change: state.validName || state.validAbout || state.validDp,
        coverImg: action.data,
        validCover: false,
      };
    }
  } else if (action.type === "DISCARD") {
    return {
      name: "",
      validName: false,
      aboutMe: "",
      validAbout: false,
      dpImg: "",
      validDp: false,
      coverImg: "",
      validCover: false,
      change: false,
    };
  }
  return {
    name: "",
    validName: false,
    aboutMe: "",
    validAbout: false,
    dpImg: "",
    validDp: false,
    coverImg: "",
    validCover: false,
    change: false,
  };
}

export default function AccountMenu() {
  let [editName, setEditName] = useState(false);
  let [editAbout, setEditAbout] = useState(false);
  let dpinput = useRef();
  let coverInput = useRef();
  let dispatch = useDispatch();
  let [inputData, dispatchData] = useReducer(changeReducer, {
    name: "",
    validName: false,
    aboutMe: "",
    validAbout: false,
    dpImg: "",
    validDp: false,
    coverImg: "",
    validCover: false,
    change: false,
  });
  let CONSTANTS = useSelector((state) => state.CONSTANTS);

  async function saveDetails() {
    const fd = new FormData();
    const fd2 = new FormData();
    fd.append("newName", inputData.validName ? inputData.name : "undefined");
    fd.append(
      "image",
      inputData.validDp ? dpinput.current.files[0] : undefined
    );
    fd2.append(
      "aboutMe",
      inputData.validAbout ? inputData.aboutMe : "undefined"
    );
    fd2.append(
      "image",
      inputData.validCover ? coverInput.current.files[0] : undefined
    );
    let result;
    let result2;
    if (inputData.validName || inputData.validDp) {
      result = await axios.post(`${CONSTANTS.ip}/api/changeData`, fd);
      console.log(result);
    }
    if (inputData.validAbout || inputData.validCover) {
      result2 = await axios.post(
        `${CONSTANTS.ip}/api/changeSecondaryData`,
        fd2
      );
      console.log(result2);
    }
    if (result.data.status === "ok" || result2.data.status === "ok") {
      dispatchData({
        type: "DISCARD",
      });
      setEditAbout(false);
      setEditName(false);
      let data = await axios.get(`${CONSTANTS.ip}/api/getBasicData`);
      if (data.data.status === "ok") {
        dispatch(UserDataActions.loadUserData(data.data.user));
      }
    } else {
      // ERROR SOMETHING WENT WRONG
      dispatch(
        notificationsAction.setNotification({
          type: "error",
          message: "Something Went Wrong",
        })
      );
    }
  }

  const userProfileData = useSelector((state) => state.USERDATA);
  return (
    <div className="AccountSettings-MasterCont">
      <div className="Friends-topBar">
        <h2
          onClick={() => {
            dispatch(
              notificationsAction.setNotification({
                type: "ok",
                message: "yes",
              })
            );
          }}
        >
          Account
        </h2>
      </div>
      <div className="AccountSettings-MasterCont_RenderCont">
        <div className="AccountCard">
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              return;
            }}
            className="DirectMessages_UserProfileContext"
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
            <div className="ImgCont">
              <div className="coverImageCont">
                {userProfileData.coverImage !== "undefined" ? (
                  <img
                    src={
                      inputData.coverImg ||
                      `/Images/${userProfileData.coverImage}`
                    }
                    className="coverImage"
                  />
                ) : inputData.coverImg ? (
                  <img src={inputData.coverImg} className="coverImage" />
                ) : (
                  <div className="NOCoverImage"></div>
                )}
                <label
                  className="edit-coverImage-label"
                  htmlFor="coverImageInput"
                >
                  <motion.i
                    class="ph-pencil edit-coverImage"
                    whileHover={{
                      scale: 1.12,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.3,
                        type: "spring",
                      },
                    }}
                  ></motion.i>
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="coverImageInput"
                  accept=".gif,.jpg,.jpeg,.png"
                  ref={coverInput}
                  onChange={(e) => {
                    if (
                      ![
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/png",
                      ].includes(e.target.files[0])
                    ) {
                      dispatch(
                        notificationsAction.setNotification({
                          type: "error",
                          message: "Only images are allowed as a Cover Image",
                        })
                      );
                      return;
                    }
                    if (e.target.files[0].size > 5 * 1024 * 1024) {
                      dispatch(
                        notificationsAction.setNotification({
                          type: "error",
                          message: "Cover Image must be less than 5MB",
                        })
                      );
                      return;
                    }
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(e.target.files[0]);
                    fileReader.onload = () => {
                      dispatchData({
                        type: "COVER_CHANGE",
                        data: fileReader.result,
                      });
                    };
                  }}
                />
              </div>
              <div className="userProfileImageCont">
                <img
                  src={inputData.dpImg || `/Images/${userProfileData.image}`}
                  className="userProfileImage"
                />
                <label className="edit-image-label" htmlFor="dpInput">
                  <motion.i
                    class="ph-pencil edit-image"
                    initial={{
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    whileHover={{
                      scale: 1.12,
                      translateX: "-50%",
                      translateY: "-50%",
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.3,
                        type: "spring",
                      },
                    }}
                  >
                    {/* <label htmlFor="dpInput">lolol</label> */}
                  </motion.i>
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="dpInput"
                  accept=".gif,.jpg,.jpeg,.png"
                  ref={dpinput}
                  onChange={(e) => {
                    if (
                      ![
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/png",
                      ].includes(e.target.files[0])
                    ) {
                      dispatch(
                        notificationsAction.setNotification({
                          type: "error",
                          message: "Only images are allowed as a Profile Image",
                        })
                      );
                      return;
                    }
                    if (e.target.files[0].size > 5 * 1024 * 1024) {
                      dispatch(
                        notificationsAction.setNotification({
                          type: "error",
                          message: "Profile Image must be less than 5MB",
                        })
                      );
                      return;
                    }
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(e.target.files[0]);
                    fileReader.onload = () => {
                      dispatchData({
                        type: "DP_CHANGE",
                        data: fileReader.result,
                      });
                    };
                  }}
                />
              </div>
            </div>
            <div className="userProfileData">
              <div className="nameCont">
                <div className="nameCont-main">
                  {editName && (
                    // <form className="nameSubmitForm">
                    <input
                      type="text"
                      placeholder={userProfileData.name}
                      onChange={(e) =>
                        dispatchData({
                          type: "NAME_CHANGE",
                          userName: userProfileData.name,
                          data: e.target.value,
                        })
                      }
                    />
                    // </form>
                  )}
                  {!editName && <span>{userProfileData.name}</span>}
                </div>
                <div className="nameCont-btnCont">
                  {!editName && (
                    <motion.i
                      class="ph-pencil edit-name"
                      whileHover={{
                        scale: 1.12,
                        transition: {
                          duration: 0.2,
                          type: "spring",
                        },
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: {
                          duration: 0.3,
                          type: "spring",
                        },
                      }}
                      onClick={() => setEditName(true)}
                    ></motion.i>
                  )}
                  {editName && (
                    <motion.i
                      class="ph-x cancel-name"
                      whileHover={{
                        scale: 1.12,
                        transition: {
                          duration: 0.2,
                          type: "spring",
                        },
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: {
                          duration: 0.3,
                          type: "spring",
                        },
                      }}
                      onClick={() => {
                        dispatchData({
                          type: "NAME_CHANGE",
                          userName: userProfileData.name,
                          data: "",
                        });
                        setEditName(false);
                      }}
                    ></motion.i>
                  )}
                </div>
              </div>
              <p>63afb31ac4c8428272a2343c</p>
            </div>
            {/* {userProfileData.aboutMe === "undefined" ? (
              ""
            ) : ( */}
            <div className="userProfileAboutMe">
              <div className="aboutMeCont">
                <span>About Me</span>
                {!editAbout && (
                  <motion.i
                    class="ph-pencil edit-aboutMe"
                    whileHover={{
                      scale: 1.12,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.3,
                        type: "spring",
                      },
                    }}
                    onClick={() => setEditAbout(true)}
                  ></motion.i>
                )}
                {editAbout && (
                  <motion.i
                    class="ph-x cancel-aboutMe"
                    whileHover={{
                      scale: 1.12,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.3,
                        type: "spring",
                      },
                    }}
                    onClick={() => {
                      dispatchData({
                        type: "ABOUT_CHANGE",
                        about: userProfileData.aboutMe,
                        data: "",
                      });
                      setEditAbout(false);
                    }}
                  ></motion.i>
                )}
              </div>
              {!editAbout && (
                <p>
                  {userProfileData.aboutMe === "undefined" ? (
                    <span>* Let the World Know about You *</span>
                  ) : (
                    userProfileData.aboutMe
                  )}
                </p>
              )}
              {editAbout && (
                <textarea
                  className="aboutMeinput"
                  maxLength="75"
                  placeholder={
                    userProfileData.aboutMe === "undefined"
                      ? "Let the World Know about You "
                      : userProfileData.aboutMe
                  }
                  onChange={(e) =>
                    dispatchData({
                      type: "ABOUT_CHANGE",
                      about: userProfileData.aboutMe,
                      data: e.target.value,
                    })
                  }
                />
              )}
            </div>
            {/* )} */}
          </motion.div>
        </div>
        <AnimatePresence initial={false} exitBeforeEnter={true}>
          {inputData.change && (
            <motion.div
              className="saveCont"
              initial={{
                bottom: "-7rem",
              }}
              animate={{
                bottom: "2rem",
                transition: {
                  duration: 0.3,
                  type: "spring",
                },
              }}
              exit={{
                bottom: "-7rem",
                transition: {
                  duration: 0.3,
                  type: "spring",
                },
              }}
            >
              <p>You Have Unsaved Changes</p>
              <div className="btnCont">
                <motion.button
                  whileHover={{
                    scale: 1.12,
                    transition: {
                      duration: 0.2,
                      type: "spring",
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                    },
                  }}
                  className="save"
                  onClick={saveDetails}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.12,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                    },
                  }}
                  className="discard"
                  onClick={() => {
                    dispatchData({
                      type: "DISCARD",
                    });
                    setEditAbout(false);
                    setEditName(false);
                  }}
                >
                  Discard
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
