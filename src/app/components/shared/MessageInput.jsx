"use client";

import { useState, useRef } from "react";
import { BiPlus } from "react-icons/bi";
import { MdOutlineGifBox } from "react-icons/md";
import { EmojiIcon } from "@/app/(main)/(messages)/messages/components/MessagesIcons";
import EmojiPicker from "@/app/(main)/(messages)/messages/components/EmojiPicker";
import styles from "@/app/ui/styles.module.css";

export default function MessageInput({ onSend, placeholder = "Type a message..." }) {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const onEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.messageInputContainer}>
      <form onSubmit={handleSubmit} className={styles.messageForm}>
        <button type="button" className={styles.attachButton}>
          <BiPlus />
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={styles.messageInput}
          rows={1}
        />

        <div className={styles.messageInputActions}>
          <button
            type="button"
            className={styles.emojiButton}
            onClick={() => setShowPicker(!showPicker)}
          >
            <EmojiIcon />
          </button>
          <button type="button" className={styles.gifButton}>
            <MdOutlineGifBox />
          </button>
        </div>

        {showPicker && (
          <div className={styles.emojiPickerContainer}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </form>
    </div>
  );
}
