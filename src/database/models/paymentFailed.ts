var mongoose = require('mongoose')

const paymentMessageSchema = new mongoose.Schema({
    // type: {
    //     type: String,
    //     enum: ['success', 'failed']
    // },
    message: { type: String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }

},{timestamps: true, versionKey: false});

export const paymentMessageFailedModel = mongoose.model('paymentFailedMessage', paymentMessageSchema)