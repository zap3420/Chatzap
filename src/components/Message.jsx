import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from 'date-fns';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [isScaled, setIsScaled] = useState(false);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const getMessageTimestamp = (timestamp) => {
    const formattedTimestamp = format(timestamp.toDate(), "h:mm a");
    return formattedTimestamp;
  };

  const handleImageClick = () => {
    setIsScaled(!isScaled);
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{getMessageTimestamp(message.date)}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && (
          <img
            src={message.img}
            alt=""
            onClick={handleImageClick}
            className={isScaled ? "scaled" : ""}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
