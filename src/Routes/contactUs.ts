import express from 'express'
import { addContactUs, deleteContactUs, editContactUs, getContactUs } from '../controllers/contactUs';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add',addContactUs)
router.use(adminJWT)
router.post('/edit',editContactUs)
router.delete('/delete/:id',deleteContactUs)
router.get('/',getContactUs)

export const contactUsRoutes = router