import { COURSE_REGISTER_PAYMENT_METHOD, COURSE_REGISTER_PAYMENT_STATUS } from "../../common";

var mongoose = require('mongoose')

const courseRegisterSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId,ref:'course' },
 name: { type: String },
 gender: { type: String },
 standard: { type: String },
 schoolName: { type: String },
 city: { type: String },
 whatsAppNumber: { type: String },
  email: { type: String },
   previousPercentage: { type: Number, min: 0, max: 100 }, // % obtained in previous standard
  targetPercentage: { type: Number, min: 0, max: 100 },   // % targeted for current year
  goal: { type: String },  
  // paymentMethod: { type: String, enum:Object.values(COURSE_REGISTER_PAYMENT_METHOD)},
  transactionId: { type: String },
  paymentStatus: { type: String, enum:Object.values(COURSE_REGISTER_PAYMENT_STATUS), default: "Pending" },
   fees:{type:Number},
  // paidDateTime: { type: Date, default: Date.now },
  // profession: { type: String },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },

}, { timestamps: true, versionKey: false });


export const courseRegisterModel = mongoose.model('course-register',courseRegisterSchema);