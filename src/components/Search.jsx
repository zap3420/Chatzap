import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import debounce from "lodash.debounce";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async (username) => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false); // Reset error state
      } else {
        setUser(null); // Clear user state if no user is found
        setErr(true); // Set error state
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setErr(true); // Set error state
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      debounce(async (username) => {
        try {
          await handleSearch(username);
        } catch (error) {
          console.error("Error searching for user:", error);
          setErr(true); // Set error state
        }
      }, 300)(value);
    } else {
      setUser(null);
      setErr(false);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch(username);
    }
  };

  const handleSelect = async () => {
    if (!user) {
      console.error("No user selected");
      return;
    }

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create a chat in chats collection if it doesn't exist
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }

      // Update userChats for current user with the new chat
      await setDoc(
        doc(db, "userChats", currentUser.uid),
        {
          [combinedId]: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            chatId: combinedId,
          },
        },
        { merge: true } // Merge with existing document instead of overwriting
      );

      // Update userChats for selected user with the new chat
      await setDoc(
        doc(db, "userChats", user.uid),
        {
          [combinedId]: {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            chatId: combinedId,
          },
        },
        { merge: true } // Merge with existing document instead of overwriting
      );

      // Dispatch action to update user information and chat ID in chat context
      dispatch({ type: "CHANGE_USER", payload: user, chatId: combinedId });
    } catch (error) {
      console.error("Error handling user selection:", error);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Press Enter to search"
          onKeyDown={handleKey}
          onChange={handleChange}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
