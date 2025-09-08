import express from "express";
import { adminJWT } from "../helper";
import { addLanguage, deleteLanguage, editLanguage, getLanguage } from "../controllers/language";

const router = express.Router();

router.use(adminJWT)
router.post('/add',addLanguage)
router.post('/edit',editLanguage)
router.get('/',getLanguage)
router.delete('/delete/:id',deleteLanguage)


export const languageRoutes = router;