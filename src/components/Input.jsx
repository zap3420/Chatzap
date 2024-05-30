import React, { useContext, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions } from "react-icons/md";

const Input = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const chatId = data.chatId; // Get the chatId from ChatContext
    if (!chatId) {
      console.error("No chatId found");
      return;
    }

    if (img) {
      // Generate a unique message ID using image name and current timestamp
      const messageId = `${img.name}_${Date.now()}`;
      const storageRef = ref(storage, messageId);

      const uploadTask = uploadBytesResumable(storageRef, img);

      try {
        // Wait for the upload to be complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
              reject(error);
            },
            () => {
              resolve();
            }
          );
        });

        // Get download URL after successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update Firestore document with the message details
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: messageId, // Use generated message ID
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      } catch (error) {
        console.error("Error updating messages:", error);
      }
    } else {
      try {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: Date.now(), // Use timestamp as unique message ID
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        console.error("Error updating messages:", error);
      }
    }
    setText("");
    setImg(null);
    setImgPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="input">
      <div className="input-container">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          value={text}
          className="text-input"
        />
      </div>
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          {imgPreview ? (
            <img
              src={imgPreview}
              alt="Img Preview"
              className="image-preview"
            />
          ) : (
            <RiImageAddFill style={{ fontSize: "24px" }} />
          )}
        </label>
        <label className="emoji">
          <MdEmojiEmotions
            style={{ fontSize: "24px" }}
            onClick={() => setOpen((prev) => !prev)}
          />
        </label>
        <div className={`picker ${open ? "open" : ""}`}>
          <EmojiPicker onEmojiClick={handleEmoji} />
        </div>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
