var mongoose = require('mongoose');
const adminSettingSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: Number },
    whatsappKey:{type: String},
    whatsappUrl: { type: String },
    senderEmail: { type: String },
    emailPassword: { type: String },
   
    profilePhoto: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

export const adminSettingModel = mongoose.model('adminSetting', adminSettingSchema);