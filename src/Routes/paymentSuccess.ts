import { Router } from "express";
import { getPaymentMessages, getPaymentMessagesByType, addEditPaymentMessage, deletePaymentMessage, getPaymentMessageById } from "../controllers/paymentMessage";

const router = Router();

// Get all payment success messages
router.get("/", getPaymentMessages);

// Get payment success messages by type
// router.get("/type/:type", getPaymentMessagesByType);

// Get single payment success message by ID
// router.get("/:id", getPaymentMessageById);

// Add/Edit payment success message
router.post("/add/edit", addEditPaymentMessage);

// Delete payment success message
// router.delete("/:id", deletePaymentMessage);

export default router;
