var mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
    name: { type: String },
    priority:{type:Number,default:1},
      isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

export const languageModel = mongoose.model('language', languageSchema);