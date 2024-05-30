import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { format } from 'date-fns'; 
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const messagesRef = useRef(null); // Ref for the messages div

  useEffect(() => {
    // If there's no chat selected, don't fetch messages
    if (!data.chatId) {
      setMessages([]);
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages" ref={messagesRef}>
      {data.chatId ? (
        messages.length > 0 ? (
          messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {/* Check if it's the first message or the date of the current message is different from the previous message */}
              {index === 0 || messages[index - 1].date.toDate().toLocaleDateString() !== message.date.toDate().toLocaleDateString() ? (
                <div className="dateDivider">{format(message.date.toDate(), 'd MMMM')}</div>
              ) : null}
              <Message message={message} />
            </React.Fragment>
          ))
        ) : (
          <div className="no-messages">
            <p>Please select a chat to start messaging.</p>
          </div>
        )
      ) : (
        <div className="no-chat-selected">
          <p>Choose a chat to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
