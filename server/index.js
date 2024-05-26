import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connectDB.js";
import { generatePandQ } from "./utils/schnorr.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

global.p = BigInt(0n);
global.q = BigInt(0n);
global.alpha = BigInt(0n);

app.use(express.json());
app.use(cors({ origin: `http://localhost:5173`, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  connectDB();
  const { p, q, alpha } = generatePandQ();
  global.p = p;
  global.q = q;
  global.alpha = alpha;
  console.log(`Server is running on port ${PORT}`);
});
