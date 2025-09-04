import express from "express"
import { adminJWT } from "../helper"
import { add_edit_web_Setting } from "../controllers/webSetting"

const router = express.Router()

router.get('/',add_edit_web_Setting)
router.use(adminJWT)
router.post('/add/edit',add_edit_web_Setting)

export const webSettingRoutes = router