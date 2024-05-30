import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, doc, onSnapshot } from "../firebase";

const Chats = () => {
  const [userChats, setUserChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getUserChats = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userChatsRef = doc(db, "userChats", currentUser.uid);
          const unsubscribe = onSnapshot(userChatsRef, (snapshot) => {
            const chatsData = snapshot.data();
            const chatsArray = chatsData ? Object.keys(chatsData).map(userId => ({
              userId,
              ...chatsData[userId]
            })) : [];
            setUserChats(chatsArray);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching user chats:", error);
        }
      }
    };

    getUserChats();
  }, [currentUser]); // Add currentUser to the dependency array

  const handleSelect = async (user) => {
    try {
      const userInfo = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      };
  
      dispatch({ type: "CHANGE_USER", payload: userInfo });
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  
  return (
    <div className="chats">
      {userChats.map((chat) => (
        <div
          className="userChat"
          key={chat.userId}
          onClick={() => handleSelect(chat)}
        >
          <img src={chat.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
