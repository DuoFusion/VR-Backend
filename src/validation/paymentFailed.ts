import joi from 'joi'

export const addEditPaymentFailedSchema = joi.object().keys({
    message: joi.string().required()
})