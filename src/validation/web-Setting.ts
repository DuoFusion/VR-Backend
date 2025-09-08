import joi from "joi"

export const addEditwebSettingSchema = joi.object().keys({
    name: joi.string(),
    email: joi.string(),
    phoneNumber: joi.number(),
    razorpayKeyId: joi.string(),
    razorpayKeySecret: joi.string(),
    ourStudent: joi.number(),
    rating: joi.number(),
    socialMedia: {
        instagram: joi.string().allow(null, ''),
        facebook: joi.string().allow(null, ''),
        twitter: joi.string().allow(null, ''),
        linkedin: joi.string().allow(null, ''),
        youtube: joi.string().allow(null, '')
    }
})