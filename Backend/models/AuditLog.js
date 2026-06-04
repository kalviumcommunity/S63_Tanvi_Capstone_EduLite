const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., "DELETE_STUDENT", "UPDATE_FEE", "ADD_COURSE"
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId }, // The ID of the student, course, etc. being acted upon
    details: { type: String }, // Additional details/JSON string representation
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
module.exports = AuditLog;
