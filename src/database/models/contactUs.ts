const mongoose = require('mongoose')
const contactUsSchema = new mongoose.Schema({
    name: { type: String,},
    email: { type: String},
    // phoneNumber: { type: String, required: true },
    message: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const contactUsModel = mongoose.model('contactUs', contactUsSchema);