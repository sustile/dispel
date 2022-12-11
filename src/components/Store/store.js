import { createSlice, configureStore } from "@reduxjs/toolkit";

const controlsOptions = createSlice({
  name: "controls",
  initialState: {
    deafen: false,
    mute: false,
    screenShare: false,
  },
  reducers: {
    toggleDeafen(state) {
      state.deafen = !state.deafen;
    },
    toggleMute(state) {
      state.mute = !state.mute;
    },
    toggleScreenShare(state) {
      state.screenShare = !state.screenShare;
    },
  },
});

const CONSTANTS = createSlice({
  name: "CONSTANTS",
  initialState: {
    ip: "http://localhost:4000",
  },
});

const USERDATA = createSlice({
  name: "USERDATA",
  initialState: {
    aboutMe: "",
    coverImage: "",
    email: "",
    id: "",
    name: "",
    image: "",
  },
  reducers: {
    loadUserData(state, action) {
      return { ...action.payload };
    },
    changeName(state, action) {
      state.name = action.payload;
    },
    changeImage(state, action) {
      state.image = action.payload;
    },
    changeAboutMe(state, action) {
      state.aboutMe = action.payload;
    },
    changeCoverImage(state, action) {
      state.coverImage = action.payload;
    },
  },
});

const allDms = createSlice({
  name: "allDms",
  initialState: [
    {
      dmId: "8236408237",
      name: "Systile",
      image: "test.gif",
    },
  ],
  reducers: {
    loadDMs(state, action) {
      return [...action.payload];
    },
  },
});

const allServers = createSlice({
  name: "allServers",
  initialState: [
    {
      serverId: "823480237",
      name: "Test Server 1",
      image: "test.gif",
    },
  ],
  reducers: {
    loadServers(state, action) {
      return [...action.payload];
    },
  },
});

const currentMainCont = createSlice({
  name: "currentMainCont",
  initialState: {
    value: "friendsCont",
    id: "",
    name: "",
  },
  reducers: {
    changeCont(state, action) {
      state.value = action.payload.value;
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
});

const allDmMessages = createSlice({
  name: "allDmMessages",
  initialState: [
    // {
    //   dmId : "3247923u42384923",
    //   isMaximum : false,
    //   page : 1,
    //   messages : []
    // }
  ],
  reducers: {
    addMessage(state, action) {
      if (state.length !== 0) {
        let check = state.filter((el) => el.dmId === action.payload.dmId);
        if (check.length > 0) {
          check = check[0];
        } else {
          check = undefined;
        }
        if (!check) {
          return [
            ...state,
            {
              dmId: action.payload.dmId,
              isMaximum: false,
              page: 1,
              messages: [action.payload],
            },
          ];
        } else {
          if (action.payload.lazyLoad) {
            return state.map((el) => {
              if (el.dmId === action.payload.dmId) {
                return {
                  dmId: action.payload.dmId,
                  isMaximum: el.isMaximum,
                  page: el.page,
                  messages: [action.payload, ...check.messages],
                };
              } else {
                return el;
              }
            });
          }
          return state.map((el) => {
            if (el.dmId === action.payload.dmId) {
              return {
                dmId: action.payload.dmId,
                isMaximum: el.isMaximum,
                page: el.page,
                messages: [...check.messages, action.payload],
              };
            } else {
              return el;
            }
          });
        }
      } else {
        return [
          {
            dmId: action.payload.dmId,
            isMaximum: false,
            page: 1,
            messages: [action.payload],
          },
        ];
      }
    },
    updatePage(state, action) {
      if (state.length !== 0) {
        let check = state.filter((el) => el.dmId === action.payload.dmId);
        if (check.length > 0) {
          check = check[0];
        } else {
          check = undefined;
        }
        if (check) {
          return state.map((el) => {
            if (el.dmId === action.payload.dmId) {
              return {
                dmId: action.payload.dmId,
                isMaximum: el.isMaximum,
                page: action.payload.page,
                messages: el.messages,
              };
            } else {
              return el;
            }
          });
        }
      }
    },
    updateMaximum(state, action) {
      if (state.length !== 0) {
        let check = state.filter((el) => el.dmId === action.payload.dmId);
        if (check.length > 0) {
          check = check[0];
        } else {
          check = undefined;
        }
        if (check) {
          return state.map((el) => {
            if (el.dmId === action.payload.dmId) {
              return {
                dmId: action.payload.dmId,
                isMaximum: action.payload.isMaximum,
                page: el.page,
                messages: el.messages,
              };
            } else {
              return el;
            }
          });
        }
      }
    },

    updateMessage(state, action) {
      let check = state.filter((el) => el.dmId === action.payload.dmId);
      if (check.length > 0) {
        check = check[0];
      } else {
        check = undefined;
      }
      if (check) {
        let newMessages = check.messages.map((el) => {
          if (el.objId === action.payload.objId) {
            return action.payload;
          } else {
            return el;
          }
        });

        return state.map((el) => {
          if (el.dmId === action.payload.dmId) {
            return { ...el, messages: newMessages };
          } else {
            return el;
          }
        });
      }
    },
  },
});

const currentCallStatus = createSlice({
  name: "currentCallStatus",
  initialState: {
    status: false,
    callObj: null,
    currentCallCont: null,
    callList: [],
  },
  reducers: {
    loadObj(state, action) {
      return action.payload;
    },

    addUsers(state, action) {
      return {
        ...state,
        callList: [...state.callList, action.payload],
      };
    },

    removeUsers(state, action) {
      let x = state.callList.filter((el) => el.id !== action.payload.id);
      return {
        ...state,
        callList: x,
      };
    },

    setStatus(state, action) {
      return {
        ...state,
        status: action.payload.status,
      };
    },

    setCallObj(state, action) {
      return {
        ...state,
        callObj: action.payload.callObj,
      };
    },

    setcurrentCallCont(state, action) {
      return {
        ...state,
        currentCallCont: action.payload.currentCallCont,
      };
    },

    updateUser(state, action) {
      let x = state.callList.map((el) => {
        if (el.id === "test") {
          return {
            ...action.payload,
            stream: el.stream,
          };
        } else {
          return el;
        }
      });
      return {
        ...state,
        callList: x,
      };
    },

    closeCall() {
      return {
        status: false,
        callObj: null,
        currentCallCont: null,
        callList: [],
      };
    },
  },
});

const ContextMenu = createSlice({
  name: "contextMenu",
  initialState: {
    id: "",
  },

  reducers: {
    loadMenu(state, action) {
      return {
        id: action.payload,
      };
    },
  },
});

const store = configureStore({
  reducer: {
    controls: controlsOptions.reducer,
    USERDATA: USERDATA.reducer,
    allDms: allDms.reducer,
    allServers: allServers.reducer,
    currentMainCont: currentMainCont.reducer,
    CONSTANTS: CONSTANTS.reducer,
    allDmMessages: allDmMessages.reducer,
    currentCallStatus: currentCallStatus.reducer,
    contextMenu: ContextMenu.reducer,
  },
});

export const ControlsActions = controlsOptions.actions;
export const UserDataActions = USERDATA.actions;
export const AllDmsActions = allDms.actions;
export const AllServerActions = allServers.actions;
export const CurrentMainContActions = currentMainCont.actions;
export const ConstantsActions = CONSTANTS.actions;
export const dmMessagesAction = allDmMessages.actions;
export const currentCallStatusAction = currentCallStatus.actions;
export const ContextMenuActions = ContextMenu.actions;

export default store;
