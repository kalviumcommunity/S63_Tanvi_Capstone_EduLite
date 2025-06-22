const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");  // Using bcryptjs for consistency

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
    role: { type: String, enum: ["admin", "student"], default: "student" },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Reference to courses
    phone: { type: String },
    dob: { type: Date }, // Date of birth field (not required for Google auth)
    profilePicture: { type: String }, // Profile picture path

    // New fields for student data
    completedCourses: { type: Number, default: 0 },  // Number of courses completed
    feePaid: { type: Number, default: 0 },  // Amount of fee paid
    feeTotal: { type: Number, default: 0 },  // Total fee amount
    nextFeeDue: { type: Date, default: null },  // Date of next fee due
  },
  { timestamps: true }
);

// Hash the password before saving (only for non-Google auth users)
userSchema.pre("save", async function (next) {
  if ((this.isModified("password") || this.isNew) && !this.googleId) {
    try {
      this.password = await bcrypt.hash(this.password, 10);  // Hash the password before saving
    } catch (error) {
      next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
