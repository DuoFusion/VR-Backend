import { WORKSHOP_REGISTER_PAYMENT_METHOD, WORKSHOP_REGISTER_PAYMENT_STATUS } from "../../common";

var mongoose = require('mongoose');

const workshopRegisterSchema = new mongoose.Schema({
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'workshop' },
    name: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    city: { type: String },
    profession: { type: String },
    paymentStatus: {type:String, enum:Object.values(WORKSHOP_REGISTER_PAYMENT_STATUS) },
    fees: { type: Number, required: true },
    paymentMethod: { type: String, enum:Object.values(WORKSHOP_REGISTER_PAYMENT_METHOD), required: true },
    transactionId: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true ,versionKey: false })

export const workshopRegisterModel = mongoose.model('workshop-register',workshopRegisterSchema);

