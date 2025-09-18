// import { Router } from "express";
// import { addEditPaymentMessage, getPaymentMessages } from "../controllers/paymentsucces";
// // import { getPaymentMessages, getPaymentMessagesByType, addEditPaymentMessage, deletePaymentMessage, getPaymentMessageById } from "../controllers/paymentMessage";

// const router = Router();

// // Get all payment success messages
// router.get("/", getPaymentMessages);

// // Get payment success messages by type
// // router.get("/type/:type", getPaymentMessagesByType);

// // Get single payment success message by ID
// // router.get("/:id", getPaymentMessageById);

// // Add/Edit payment success message
// router.post("/add/edit", addEditPaymentMessage);

// // Delete payment success message
// // router.delete("/:id", deletePaymentMessage);

// export default router;


import express from 'express';
import { adminJWT } from '../helper';
// import { add_edit_about_us, get_about_us } from '../controllers/about';
import { addEditPaymentMessage, getPaymentMessages } from '../controllers/paymentsucces';
// import {  add_edit_about_us, get_about_us } from '../controllers/about';

const router = express.Router();

router.get('/', getPaymentMessages)
router.use(adminJWT)
router.post('/add/edit',addEditPaymentMessage)

export const paymentSuccessRoutes = router