import { COURSE_DISCOUNT, COURSE_LEVEL } from "../../common";

var mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  // background: { type: String, required: true },
  duration: { type: String, required: true },
  // shortDescription: { type: String, required: true },
  mrp: { type: Number },
   price: { type: Number, required: true },
   totalLectures: { type: Number, required: true },
   totalHours: { type: String, required: true },
  // whatWillYouLearn :{ type: String},
  //  rating: { type: Number, required: true },
  //  instructorName: { type: String },
  //  instructorImage: { type: String },
  link: { type: String },
   languageId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'language' }],
   courseImage: { type: String },
    level :{type: String, enum:Object.values(COURSE_LEVEL)},
     description: { type: String},
   review: { type: Number, default: 0 },
   
//  listOfLecture: [
//     {
//       title: { type: String },
//       description: { type: String },
//       _id: false
//     }
//   ],
  priority: { type: Number, default: 1 },
  features: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const courseModel = mongoose.model('course', courseSchema)