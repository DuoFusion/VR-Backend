import { WORKSHOP_STATUS } from "../../common";

var mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // shortDescription: { type: String, required: true },
  // date: { type: String, required: true },
  // time: { type: String, required: true },
  duration: { type: String, required: true },
  instructorImage: { type: String },
  instructorName: { type: String, required: true },
  // thumbnailImage: { type: String, required: true },
  // workshopImage: { type: String, required: true },
  price: { type: Number },
  // mrp: { type: Number },
  // fullDescription: { type: String },
   priority: { type: Number, default: 0 },
  features: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const workshopModel = mongoose.model('workshop', workshopSchema);

