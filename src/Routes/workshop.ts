import express from 'express'
import { addWorkshop, deleteWorkshop, getWorkshop, getWorkshopById, sendMessageToStudents, updateWorkshop } from '../controllers/workshop';
import { adminJWT } from '../helper';

const router = express.Router()

router.get('/',getWorkshop)
router.get('/:id',getWorkshopById)
router.use(adminJWT)
router.post('/add',addWorkshop)
router.post('/send-message',sendMessageToStudents)
router.post('/edit',updateWorkshop)
router.delete('/delete/:id',deleteWorkshop)


export const workshopRoutes = router;