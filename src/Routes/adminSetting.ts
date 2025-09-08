import express from "express";
import { adminJWT } from "../helper";
import { add_edit_admin_setting, get_admin_setting } from "../controllers/adminSetting";

const router = express.Router();

router.get('/',get_admin_setting)
router.use(adminJWT)
router.post('/add/edit',add_edit_admin_setting)

export const adminSettingRoutes = router;