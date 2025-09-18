// import { Router } from "express";
// import { addEditPaymentMessage, getPaymentMessages } from "../controllers/paymentsucces";
// // import { getPaymentMessages, getPaymentMessagesByType, addEditPaymentMessage, deletePaymentMessage, getPaymentMessageById } from "../controllers/paymentMessage";

// const router = Router();

// // Get all payment failed messages
// router.get("/", getPaymentMessages);

// // Get payment failed messages by type
// // router.get("/type/:type", getPaymentMessagesByType);

// // Get single payment failed message by ID
// // router.get("/:id", getPaymentMessageById);

// // Add/Edit payment failed message
// router.post("/add/edit", addEditPaymentMessage);

// // Delete payment failed message
// // router.delete("/:id", deletePaymentMessage);

// export const paymentFailedRoutes = router;

import express from 'express';
import { adminJWT } from '../helper';
import { add_edit_about_us, get_about_us } from '../controllers/about';
import { addEditPaymentMessage, getPaymentMessages } from '../controllers/paymentFailed';
// import {  add_edit_about_us, get_about_us } from '../controllers/about';

const router = express.Router();

router.get('/', getPaymentMessages)
router.use(adminJWT)
router.post('/add/edit',addEditPaymentMessage)

export const paymentFailedRoutes = router