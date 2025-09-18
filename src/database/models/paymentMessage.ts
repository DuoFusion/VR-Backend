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
        enum: ['success', 'failed']
    },
    title: {
        type: String
    },
    message: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,versionKey: false
});

export const paymentMessageModel = mongoose.model<IPaymentMessage>('paymentMessage', paymentMessageSchema);
