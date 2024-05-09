import { create } from "zustand";
import io from "socket.io-client";
import useAuth from "./useAuth";

const useSocket = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  initializeSocket: () => {
    const { authUser } = useAuth.getState();
    if (authUser) {
      const newSocket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      newSocket.on("getOnlineUsers", (users) => {
        set({ onlineUsers: users });
      });

      set({ socket: newSocket });
    }
  },

  closeSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));

export default useSocket;
