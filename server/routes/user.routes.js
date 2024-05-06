import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { getFriends } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFriends);

export default router;
