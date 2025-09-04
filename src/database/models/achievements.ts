
var mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String},
  priority: { type: Number, default: 1 },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const achievementModel = mongoose.model('achievement', achievementSchema);