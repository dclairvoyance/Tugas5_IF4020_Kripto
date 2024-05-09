import { Server } from "socket.io";
import http from "http";
import express from "express";

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

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete socketUsers[userId];
    io.emit("getOnlineUsers", Object.keys(socketUsers));
  });
});

export { app, io, server };
