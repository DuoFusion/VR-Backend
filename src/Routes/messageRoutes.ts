import { Router } from "express";
import { sendMessageToPurchasers, sendMessageToAllWorkshopStudents } from "../controllers/messageontroller";
// import { sendMessageToPurchasers } from "../controllers/message.controller";

const router = Router();

// POST /api/message/send
router.post("/send", sendMessageToPurchasers);
router.post("/send-all-workshop", sendMessageToAllWorkshopStudents);

export const messageRoutes = router;
