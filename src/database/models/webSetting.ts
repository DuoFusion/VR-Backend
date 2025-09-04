var mongoose = require('mongoose')

const webSettingSchema = new mongoose.Schema({
    name:{ type: String},
    email :{ type: String},
    phoneNumber: { type: Number},
    razorpayKeyId : { type: String},
    razorpayKeySecret : { type: String},    

      socialMedia: {
        instagram: { type: String },
        facebook: { type: String }, 
        twitter: { type: String },
        linkedin: { type: String },
        youtube: { type: String }
    },    
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export const webSettingModel = mongoose.model('profileSetting', webSettingSchema);
    