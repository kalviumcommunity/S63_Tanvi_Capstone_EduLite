const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["FEE", "DEADLINE"], required: true },
    message: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["PENDING", "SENT"], default: "PENDING" },
    channels: [{ type: String, enum: ["EMAIL", "WHATSAPP"] }],
  },
  { timestamps: true }
);

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
