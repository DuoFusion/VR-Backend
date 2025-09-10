import Router from 'express'
import { adminJWT } from '../helper';
import { addCourse, deleteCourse, editCourse, getCourse, getCourseById } from '../controllers/courses';


const router = Router();

router.get('/',getCourse)
router.get('/:id',getCourseById)

router.use(adminJWT)
router.post('/add',addCourse)
router.post('/edit',editCourse)
router.delete('/delete/:id',deleteCourse)


export const coursesRoutes = router;