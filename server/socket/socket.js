import { Server } from "socket.io";
import http from "http";
import express from "express";
import { isSharedKeyExpired } from "../utils/helpers.js";
import { generateKey, calculateSharedKey } from "../utils/ecdh.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// real-time messaging
export const getReceiverSocketId = (receiverId) => {
  return socketUsers[receiverId];
};

// online users
const socketUsers = {}; // { userId: socketId }

// shared keys
const sharedKeys = {}; // { userId: {key: sharedKey, date: createdAt} }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socketUsers[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(socketUsers));

  // handshake to share key
  socket.on("sharePublicKey", (publicKeyClient) => {
    if (!sharedKeys[userId] || isSharedKeyExpired(sharedKeys[userId]?.date)) {
      console.log("Server received public key from client:", publicKeyClient);

      const { privateKey: privateKeyServer, publicKey: publicKeyServer } =
        generateKey();
      socket.emit(
        "sharePublicKey",
        publicKeyServer.map((coord) => coord.toString())
      );

      socket.on("ackSharedKey", (ack) => {
        if (ack) {
          console.log("Server received ack from client.");
          const sharedKey = calculateSharedKey(
            privateKeyServer,
            publicKeyClient.map((str) => BigInt(str))
          );
          sharedKeys[userId] = {
            key: sharedKey,
            createdAt: new Date().toISOString(),
          };
          console.log(sharedKey);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete socketUsers[userId];
    io.emit("getOnlineUsers", Object.keys(socketUsers));
  });
});

export { app, io, server };
