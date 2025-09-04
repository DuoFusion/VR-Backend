import express from 'express'
import { adminJWT } from '../helper'
import { addFAQ, deleteFAQ, editFAQ, getFAQ } from '../controllers/faq'

const router = express.Router()

router.get('/',getFAQ)

router.use(adminJWT)
router.post('/add',addFAQ)
router.post('/edit',editFAQ)
router.delete('/delete/:id',deleteFAQ)
export const faqRoutes = router