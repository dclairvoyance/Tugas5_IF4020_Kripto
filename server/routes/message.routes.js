import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { get, send } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:receiverId", protectRoute, get);
router.post("/send/:receiverId", protectRoute, send);

export default router;
