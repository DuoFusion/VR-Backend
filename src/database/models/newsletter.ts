

const mongoose = require('mongoose')

const newsLetterSchema = new mongoose.Schema({
    email: { type: String },
    archive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const newsLetterModel = mongoose.model('newsletter', newsLetterSchema);