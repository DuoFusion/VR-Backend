// import mongoose, { Schema, Document } from 'mongoose';

// export interface IPaymentMessage extends Document {
//     type: 'success' | 'failed';
//     title: string;
//     message: string;
//     isActive: boolean;
//     isDeleted: boolean;
//     createdBy: string;
//     updatedBy: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const paymentMessageSchema = new Schema<IPaymentMessage>({
//     type: {
//         type: String,
//         enum: ['success', 'failed']
//     },
//     title: {
//         type: String
//     },
//     message: {
//         type: String
//     },
//     isBlocked: {
//         type: Boolean,
//         default: true
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     }
// }, {
//     timestamps: true,versionKey: false
// });

// export const paymentMessageModel = mongoose.model<IPaymentMessage>('paymentMessage', paymentMessageSchema);
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

export const paymentMessageSuccessModel = mongoose.model('paymentSuccessMessage', paymentMessageSchema)