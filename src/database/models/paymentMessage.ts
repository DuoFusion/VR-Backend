import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentMessage extends Document {
    type: 'success' | 'failed';
    title: string;
    message: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentMessageSchema = new Schema<IPaymentMessage>({
    type: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const paymentMessageModel = mongoose.model<IPaymentMessage>('paymentMessage', paymentMessageSchema);
