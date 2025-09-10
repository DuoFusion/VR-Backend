import Router from "express"
import { adminJWT } from "../helper"
import { addBlog, deleteBlog, editBlog, getBlog, getBlogById } from "../controllers/blog"

const router = Router()

router.get('/',getBlog)
router.get('/:id',getBlogById)
router.use(adminJWT)
router.post('/add',addBlog)
router.post('/edit',editBlog)
router.delete('/delete/:id',deleteBlog)

export const blogRoutes = router
