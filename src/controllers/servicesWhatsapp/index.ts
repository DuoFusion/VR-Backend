import { Request, Response } from "express";
import { sendWhatsAppMessage } from "../../services/whatsapp.service";

// ✅ Send message manually
export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: "to & message required" });

    const response = await sendWhatsAppMessage(to, message);
    return res.status(200).json({ success: true, response });
  } catch {
    return res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Webhook Verify (GET)
export const verifyWebhook = (req: Request, res: Response): Response => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("Webhook verified");
      return res.status(200).send(challenge as string);
    } else {
      return res.sendStatus(403);
    }
  } catch {
    return res.sendStatus(500);
  }
};

// ✅ Webhook Receiver (POST)
export const receiveWebhook = (req: Request, res: Response): Response => {
  try {
    console.log("Webhook data:", JSON.stringify(req.body, null, 2));
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};
