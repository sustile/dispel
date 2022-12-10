import React from "react";
import ServerMessages_Header from "./ServerMessages_Header";
import ServerMessages_Message from "./ServerMessages_Message";
import { motion } from "framer-motion";
import ServerMessage_Channels from "./ServerMessage_Channels";
function ServerMessages(props) {
  function inputHandler(e) {
    e.preventDefault();
  }
  return (
    <div className="ServerMessages_MainCont">
      <div className="ServerMessages_ChannelsCont">
        <div className="ServerMessages_ChannelsCont-TextChannels ServerMessages_ChannelsCont-ChannelType">
          <h2>Text Channels</h2>
          <div className="ServerMessages_ChannelsCont-Wrapper">
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
            <ServerMessage_Channels type="text" />
          </div>
        </div>
        <div className="ServerMessages_ChannelsCont-VoiceChannels ServerMessages_ChannelsCont-ChannelType">
          <h2>Voice Channels</h2>
          <div className="ServerMessages_ChannelsCont-Wrapper">
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
            <ServerMessage_Channels type="voice" />
          </div>
        </div>
      </div>
      <div className="ServersMessages_MessageWrapper">
        <ServerMessages_Header name={props.data.name} />
        <div className="ServersMessages_MessageBody">
          <div className="ServerMessages_MessagesCont">
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
            <ServerMessages_Message />
          </div>
          <div className="ServerMessages-InputWrapper">
            <form onSubmit={inputHandler}>
              <input
                type="text"
                placeholder={`Send a Message in ${props.data.name}`}
                maxLength="200"
                minLength="1"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerMessages;
