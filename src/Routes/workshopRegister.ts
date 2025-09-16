import express from 'express'
import { addWorkShopRegister, deleteworkshopRegister, getworkshopRegister, sendMessageToStudents, updateworkshopRegister, verifyRazorpayPayment } from '../controllers/workshopRegister';
import { adminJWT } from '../helper';

const router = express.Router()

router.post('/add',addWorkShopRegister)
router.post('/verify',verifyRazorpayPayment)
router.use(adminJWT)

router.post('/send-message',sendMessageToStudents)
router.post('/edit',updateworkshopRegister)
router.get('/',getworkshopRegister)
router.delete('/delete/:id',deleteworkshopRegister)


export const workshopRegisterRoutes = router;