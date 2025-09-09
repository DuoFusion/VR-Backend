import { string } from "joi";

var mongoose = require('mongoose')

const webSettingSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phoneNumber: { type: Number },
  address: { type: String },
  razorpayKeyId: { type: String },
  razorpayKeySecret: { type: String },
  ourStudent: { type: String, default: 0 },
  rating: { type: String, default: 0 },
  socialMedia: {
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    youtube: { type: String }
  },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export const webSettingModel = mongoose.model('profileSetting', webSettingSchema);
