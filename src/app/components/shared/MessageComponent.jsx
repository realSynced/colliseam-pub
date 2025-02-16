"use client";

import { useState } from "react";
import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import { EmojiIcon, ReplyIcon } from "@/app/(main)/(messages)/messages/components/MessagesIcons";
import MessageWithReadMore from "@/app/(main)/(messages)/messages/components/MessageWithReadMore";
import MessageTimestamp from "@/app/(main)/project/[projectname]/[tabname]/components/MessageTimestamp";
import styles from "@/app/ui/styles.module.css";

export default function MessageComponent({ 
  messageGroup, 
  currentUserId, 
  onDelete,
  onReply,
  showUserInfo = true 
}) {
  const [showActions, setShowActions] = useState(false);
  const firstMessage = messageGroup[0];
  const isCurrentUser = firstMessage.user_id === currentUserId;

  return (
    <div 
      className={`${styles.messageGroup} ${isCurrentUser ? styles.currentUser : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showUserInfo && (
        <div className={styles.messageHeader}>
          <div className={styles.userInfo}>
            {firstMessage.user_avatar && (
              <Image
                src={firstMessage.user_avatar}
                alt="User avatar"
                width={32}
                height={32}
                className={styles.avatar}
              />
            )}
            <span className={styles.username}>{firstMessage.username}</span>
          </div>
          <MessageTimestamp timestamp={firstMessage.created_at} />
        </div>
      )}

      <div className={styles.messagesContainer}>
        {messageGroup.map((message, index) => (
          <div key={message.id} className={styles.messageWrapper}>
            <MessageWithReadMore text={message.content} />
            
            {showActions && (
              <div className={styles.messageActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => onReply(message)}
                >
                  <ReplyIcon />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => onDelete(message.id)}
                >
                  <HiDotsHorizontal />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
