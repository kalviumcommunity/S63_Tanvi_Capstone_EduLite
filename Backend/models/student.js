const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completedCourses: {
    type: Number,
    required: true,
    default: 0,
  },
  totalCourses: {
    type: Number,
    required: true,
  },
  feePaid: {
    type: Number,
    required: true,
    default: 0,
  },
  feeTotal: {
    type: Number,
    required: true,
  },
  nextFeeDue: {
    type: String, // Could also be Date, but keeping String for easier format handling
    required: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
