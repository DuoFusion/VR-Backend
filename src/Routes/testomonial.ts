import express from 'express'
import { addTestomonial, deleteTestomonial, editTestomonial, getTestomonial } from '../controllers/testomonial'
import { adminJWT } from '../helper'

const router = express.Router()

router.get('/',getTestomonial)
router.use(adminJWT)
router.post('/add',addTestomonial)
router.post('/edit',editTestomonial)
router.delete('/delete/:id',deleteTestomonial)

export const testomonialRoutes = router