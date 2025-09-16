import express from 'express'
import { addCourseRegister, deleteCourseRegister, editcourseRegister, getCourseRegister, sendMessageToStudents, verifyRazorpayPayment } from '../controllers/courseRegister'
import { adminJWT } from '../helper'

const router = express.Router()

router.post('/add', addCourseRegister)
router.post('/verify', verifyRazorpayPayment)
router.use(adminJWT)

router.post("/send-message", sendMessageToStudents);
router.post('/edit',editcourseRegister)
router.get('/',getCourseRegister)
router.delete('/delete/:id',deleteCourseRegister)

export const courseRegisterRoutes = router