import joi from 'joi'

export const addEditPaymentSuccessSchema = joi.object().keys({
    message: joi.string().required()
})