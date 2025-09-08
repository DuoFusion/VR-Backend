import joi from 'joi'

export const addEditAboutUsSchema = joi.object().keys({
    aboutUs: joi.string().required()
})