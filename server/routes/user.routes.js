import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { getChats } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getChats);

export default router;
