var mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  blogImage: { type: String },
  thumbnailImage: { type: String },
  priority: { type: Number, default: 1 },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const blogModel = mongoose.model('blog', blogSchema);