import { create } from "zustand";

const useChat = create((set) => ({
  selectedChat: null,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  chats: [],
  setChats: (chats) => set({ chats }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  newChat: false,
  setNewChat: (newChat) => set({ newChat }),
}));

export default useChat;
