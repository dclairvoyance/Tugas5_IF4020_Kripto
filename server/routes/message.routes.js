import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { get, send, schnorr } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/schnorr", protectRoute, schnorr);
router.post("/send/:receiverId", protectRoute, send);
router.get("/:receiverId", protectRoute, get);

export default router;
