import { create } from "zustand";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import useAuth from "./useAuth";
import { isSharedKeyExpired } from "../utils/helpers";
import { generateKey, calculateSharedKey } from "../utils/ecdh";

const useSocket = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  sharedKey: JSON.parse(localStorage.getItem("cc-shared-key")) || null,

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

      // handshake to share key
      if (!get().sharedKey || isSharedKeyExpired(get().sharedKey.createdAt)) {
        console.log("Client sends public key.");
        const { privateKey: privateKeyClient, publicKey: publicKeyClient } =
          generateKey();

        const uuid = uuidv4();

        newSocket.emit("sharePublicKey", {
          publicKeyClient: publicKeyClient.map((coord) => coord.toString()),
          uuid,
        });

        newSocket.on("sharePublicKey", (publicKeyServer) => {
          console.log(
            "Client received public key from server",
            publicKeyServer
          );
          const sharedKey = calculateSharedKey(
            privateKeyClient,
            publicKeyServer.map((str) => BigInt(str))
          );
          const newSharedKey = {
            uuid,
            key: sharedKey,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem("cc-shared-key", JSON.stringify(newSharedKey));
          set({ sharedKey: newSharedKey });

          console.log("Client sends ack.");
          newSocket.emit("ackSharedKey", true);
        });
      }

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
