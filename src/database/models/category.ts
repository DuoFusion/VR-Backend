
var mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String},
    priority: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }

}, { timestamps: true, versionKey: false })

export const categoryModel = mongoose.model('category', categorySchema);