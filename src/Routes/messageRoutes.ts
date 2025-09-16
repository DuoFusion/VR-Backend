import { Router } from "express";
import { sendMessageToPurchasers } from "../controllers/messageontroller";
// import { sendMessageToPurchasers } from "../controllers/message.controller";

const router = Router();

// POST /api/message/send
router.post("/send", sendMessageToPurchasers);

export const messageRoutes = router;
