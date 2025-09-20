import { WORKSHOP_REGISTER_GENDER, WORKSHOP_REGISTER_PAYMENT_METHOD, WORKSHOP_REGISTER_PAYMENT_STATUS } from "../../common";

var mongoose = require("mongoose");

const workshopRegisterSchema = new mongoose.Schema(
  {
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "workshop" },
    name: { type: String },
    gender: { type: String, enum: Object.values(WORKSHOP_REGISTER_GENDER) },
    standard: { type: String },
    schoolName: { type: String },
    city: { type: String },
    whatsAppNumber: { type: String },
    email: { type: String },
    previousPercentage: { type: Number, min: 0, max: 100 }, // % obtained in previous standard
    targetPercentage: { type: Number, min: 0, max: 100 }, // % targeted for current year
    goal: { type: String },
    // email: { type: String },
    // phoneNumber: { type: String, required: true },
    // city: { type: String },
    // profession: { type: String },
    paymentStatus: { type: String, enum: Object.values(WORKSHOP_REGISTER_PAYMENT_STATUS),default:"Pending" },
    fees: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    // paymentMethod: { type: String, enum:Object.values(WORKSHOP_REGISTER_PAYMENT_METHOD), required: true },
    transactionId: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const workshopRegisterModel = mongoose.model("workshop-register", workshopRegisterSchema);
