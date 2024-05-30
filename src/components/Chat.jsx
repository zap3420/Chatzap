import React, { useContext } from "react";
import { CiVideoOn } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <BsTelephone style={{ fontSize: '22px' }}/>
          <CiVideoOn style={{ fontSize: '24px' , marginRight: '10px'}}/>
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
