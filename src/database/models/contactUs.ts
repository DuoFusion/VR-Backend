const mongoose = require('mongoose')
const contactUsSchema = new mongoose.Schema({
    name: { type: String,},
    email: { type: String},
    phoneNumber: { type: String },
    message: { type: String },
    archive: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const contactUsModel = mongoose.model('contactUs', contactUsSchema);