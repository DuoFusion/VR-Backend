import express from 'express';
import { adminJWT } from '../helper';
import { add_edit_about_us, get_about_us } from '../controllers/about';
// import {  add_edit_about_us, get_about_us } from '../controllers/about';

const router = express.Router();

router.get('/',get_about_us)
router.use(adminJWT)
router.post('/add/edit',add_edit_about_us)

export const aboutRoutes = router