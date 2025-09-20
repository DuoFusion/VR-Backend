import joi from "joi"

export const add_edit_admin_setting_Schema = joi.object({
    firstName :joi.string(),
    lastName :joi.string(),
    email :joi.string(),
    phoneNumber :joi.number(),
    profilePhoto :joi.string().allow(null, ''),
    whatsappKey:joi.string(),
    whatsappUrl:joi.string(),
    senderEmail:joi.string(),
    emailPassword:joi.string(),
})