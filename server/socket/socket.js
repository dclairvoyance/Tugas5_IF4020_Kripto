import { Server } from "socket.io";
import http from "http";
import express from "express";
import { isSharedKeyExpired } from "../utils/helpers.js";
import { generateKey, calculateSharedKey } from "../utils/ecdh.js";
import Key from "../models/key.model.js";

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

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socketUsers[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(socketUsers));

  // handshake to share key
  socket.on("sharePublicKey", async ({ publicKeyClient, uuid }) => {
    const sharedKey = await Key.findOne({ uuid });

    if (!sharedKey || isSharedKeyExpired(sharedKey.createdAt)) {
      console.log("Server received public key from client:", publicKeyClient);

      const { privateKey: privateKeyServer, publicKey: publicKeyServer } =
        generateKey();
      socket.emit(
        "sharePublicKey",
        publicKeyServer.map((coord) => coord.toString())
      );

      socket.on("ackSharedKey", async (ack) => {
        if (ack) {
          console.log("Server received ack from client.");
          const sharedKey = calculateSharedKey(
            privateKeyServer,
            publicKeyClient.map((str) => BigInt(str))
          );
          await Key.findOneAndUpdate(
            { uuid },
            { uuid, sharedKey },
            { upsert: true, runValidators: true }
          );
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
