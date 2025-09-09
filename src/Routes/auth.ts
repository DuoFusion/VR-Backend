import Router from 'express'
import { change_password, edit_user_by_id, get_all_users, get_user_by_id, login, signup } from '../controllers/auth';
import { adminJWT } from '../helper';

const router = Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/change-password',change_password)
router.use(adminJWT)
router.get('/get-user',get_all_users)
router.post('/update-profile',edit_user_by_id)
router.get('/user/:id',get_user_by_id)

export const authRoutes = router