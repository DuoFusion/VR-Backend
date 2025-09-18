import express from 'express'
import { addNewsletter, deleteNewsletter, editNewsletter, getNewsletter, sendDynamicMail } from '../controllers/newsletter';
import { adminJWT } from '../helper';


const router = express.Router();

router.post('/add', addNewsletter)

router.use(adminJWT)

router.post('/send',sendDynamicMail)
router.post('/edit',editNewsletter)
router.delete('/delete/:id',deleteNewsletter)
router.get('/',getNewsletter)


export const newsLetterRoutes = router