import express from 'express'
import { adminJWT } from '../helper'
import { addAchievements, deleteAchievements, editAchievements, getAchievements } from '../controllers/achievements'

const router = express.Router()

router.use(adminJWT)
router.post('/add',addAchievements)
router.post('/edit',editAchievements)
router.get('/',getAchievements)
router.delete('/delete/:id',deleteAchievements)

export const achievementsRoutes = router