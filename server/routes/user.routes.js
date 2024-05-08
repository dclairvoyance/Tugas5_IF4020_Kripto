import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { getUsers, getChats } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/chats", protectRoute, getChats);

export default router;
