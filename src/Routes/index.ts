"use strict"
import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import { authRoutes } from './auth'
import { workshopRoutes } from './workshop'
import { uploadRoutes } from './upload'
import { coursesRoutes } from './courses'
import { testomonialRoutes } from './testomonial'
import { workshopRegisterRoutes } from './workshopRegister'
import { courseRegisterRoutes } from './courseRegister'
import { faqRoutes } from './faq'
import { achievementsRoutes } from './achievements'
import { blogRoutes } from './blog'
import { webSettingRoutes } from './webSetting'
import { userRegistrationRoutes } from './userRegistration'
import { languageRoutes } from './language'
import { aboutRoutes } from './about'
import { newsLetterRoutes } from './newsletter'
import { contactUsRoutes } from './contactUs'
import { messageRoutes } from './messageRoutes'

const router = Router()

router.use('/auth',authRoutes)

router.use('/workshop', workshopRoutes)
router.use('/workshop-register',workshopRegisterRoutes)
router.use('/courses',coursesRoutes)
router.use('/course-register',courseRegisterRoutes)
router.use('/testomonial',testomonialRoutes)
router.use('/faq',faqRoutes)
router.use('/achievements',achievementsRoutes)
router.use('/blog',blogRoutes)
router.use('/web-setting', webSettingRoutes)
router.use('/user-registration',userRegistrationRoutes)
router.use('/language',languageRoutes)
router.use('/about',aboutRoutes)
router.use('/news-letter',newsLetterRoutes)
router.use('/contact-us',contactUsRoutes )
router.use('/message',messageRoutes)

router.use('/upload',uploadRoutes)


export { router }