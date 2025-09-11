import { WORKSHOP_STATUS } from "../../common";

var mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String},
  // date: { type: String, required: true },
  // time: { type: String, required: true },
  duration: { type: String, required: true },
  // instructorImage: { type: String },
  // instructorName: { type: String, required: true },
  thumbnailImage: { type: String },
  workshopImage: { type: String, required: true },
  price: { type: Number },
  // mrp: { type: Number },
  // fullDescription: { type: String },
   languageId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'language' }],
   priority: { type: Number, default: 0 },
   review: { type: Number, default: 0 },
   level :{type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner'},
  features: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const workshopModel = mongoose.model('workshop', workshopSchema);

