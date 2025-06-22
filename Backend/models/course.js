const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL to the course image
  duration: { type: Number, required: true }, // Duration in weeks
  price: { type: Number, required: true }, // Course price
  category: { type: String, required: true }, // Course category
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to students
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
