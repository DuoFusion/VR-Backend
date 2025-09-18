import { Router } from "express";
import { getPaymentMessages, getPaymentMessagesByType, addEditPaymentMessage, deletePaymentMessage, getPaymentMessageById } from "../controllers/paymentMessage";

const router = Router();

// Get all payment failed messages
router.get("/", getPaymentMessages);

// Get payment failed messages by type
// router.get("/type/:type", getPaymentMessagesByType);

// Get single payment failed message by ID
// router.get("/:id", getPaymentMessageById);

// Add/Edit payment failed message
router.post("/add/edit", addEditPaymentMessage);

// Delete payment failed message
// router.delete("/:id", deletePaymentMessage);

export default router;
