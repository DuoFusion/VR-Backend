import Router from 'express'
import { change_password, login, signup } from '../controllers/auth';

const router = Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/change-password',change_password)


export const authRoutes = router