import { create } from "zustand";
import { Json } from "../types/supabase";

export type MessageReadStatus = {
  read_at: string;
  user_id: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  chat_id: number;
  sender_id: string;
  attachments: Json | null;
  metadata: Json | null;
  reply_to: string | null;
  is_edit: boolean | null;
  profiles?: {
    id: string;
    username: string;
    avatar_url: string;
  } | null;
  replied_to_message?: ChatMessage | null;
  reply_to_id?: string | null;
  read_status?: MessageReadStatus[];
};

export interface MessageState {
  messages: ChatMessage[];
  actionMessage: ChatMessage | undefined;
  replyToMessage: ChatMessage | undefined;
  optimisticIds: string[];
  addMessage: (message: ChatMessage) => void;
  setOptimisticIds: (id: string) => void;
  setActionMessage: (message: ChatMessage | undefined) => void;
  setReplyToMessage: (message: ChatMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticEditMessage: (message: ChatMessage) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: undefined,
  replyToMessage: undefined,
  optimisticIds: [],
  setOptimisticIds: (id) => set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  addMessage: (newMessage) => set((state) => {
    // If this is a real message (from server) and we have its optimistic version
    if (state.optimisticIds.includes(newMessage.id)) {
      // Remove the ID from optimisticIds since we now have the real message
      return {
        messages: state.messages,
        optimisticIds: state.optimisticIds.filter(id => id !== newMessage.id)
      };
    }
    
    // Otherwise, add the new message to the list
    return {
      messages: [...state.messages, newMessage].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
      optimisticIds: state.optimisticIds
    };
  }),
  setActionMessage: (message) => set({ actionMessage: message }),
  setReplyToMessage: (message) => set({ replyToMessage: message }),
  optimisticDeleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter((message) => message.id !== messageId),
  })),
  optimisticEditMessage: (editedMessage) => set((state) => ({
    messages: state.messages.map((message) =>
      message.id === editedMessage.id ? editedMessage : message
    ),
  })),
}));
