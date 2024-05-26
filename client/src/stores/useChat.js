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
  schnorr: JSON.parse(localStorage.getItem("cc-schnorr")) || {},
  setSchnorr: (schnorr) => {
    set({ schnorr });
    localStorage.setItem("cc-schnorr", JSON.stringify(schnorr));
  },
  publicKeys: JSON.parse(localStorage.getItem("cc-public-keys")) || [],
  setPublicKeys: (publicKeys) => {
    set({ publicKeys });
    localStorage.setItem("cc-public-keys", JSON.stringify(publicKeys));
  },
  publicSigns: JSON.parse(localStorage.getItem("cc-public-signs")) || [],
  setPublicSigns: (publicSigns) => {
    set({ publicSigns });
    localStorage.setItem("cc-public-signs", JSON.stringify(publicSigns));
  },
}));

export default useChat;
