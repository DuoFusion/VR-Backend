import express from 'express'
import { sendDynamicMail } from '../controllers/mail'

const router = express.Router();

// Public endpoint to send dynamic email from frontend
router.post('/send', sendDynamicMail)

export const mailRoutes = router




