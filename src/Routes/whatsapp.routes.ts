import express from "express";
import { receiveWebhook, sendMessage, verifyWebhook } from "../controllers/servicesWhatsapp";


const router = express.Router();

// API to send custom message
router.post("/send", sendMessage);

// Meta webhook endpoints
router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveWebhook);


export const whatsappRoutes = router