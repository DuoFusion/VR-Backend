var mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
    image: { type: String },
    name: { type: String },
    role: { type: String },
    description: { type: String },
    rating: { type: Number },
    priority: { type: Number, default: 1 },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const testimonialModel = mongoose.model('testimonial', testimonialSchema)