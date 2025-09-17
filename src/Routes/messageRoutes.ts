import { Router } from "express";
import { sendMessageToPurchasers, sendMessageToAllWorkshopStudents, sendMessageToAllStudents } from "../controllers/messageontroller";
// import { sendMessageToPurchasers } from "../controllers/message.controller";

const router = Router();

// POST /api/message/send
router.post("/send", sendMessageToPurchasers);
router.post("/send-all-workshop", sendMessageToAllWorkshopStudents);
router.post("/send-all", sendMessageToAllStudents);

export const messageRoutes = router;
