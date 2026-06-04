const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');
const User = require('../models/user');

// Setup NodeMailer (Use Mailtrap or a generic SMTP for testing)
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER || "test_user",
    pass: process.env.MAILTRAP_PASS || "test_pass"
  }
});

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Running reminder scheduler...');
  try {
    const now = new Date();
    // Find pending reminders where due date is past or coming soon
    const pendingReminders = await Reminder.find({ status: "PENDING", dueDate: { $lte: now } }).populate('studentId');

    for (let reminder of pendingReminders) {
      const student = reminder.studentId;
      if (!student) continue;

      // Handle Email channel
      if (reminder.channels.includes("EMAIL")) {
        try {
          await transporter.sendMail({
            from: '"EduLite" <no-reply@edulite.com>',
            to: student.email,
            subject: reminder.type === "FEE" ? "Fee Payment Reminder" : "Important Deadline Reminder",
            text: `Hi ${student.name},\n\n${reminder.message}\n\nDue Date: ${reminder.dueDate.toDateString()}\n\nRegards,\nEduLite Team`
          });
          console.log(`[CRON] Email sent to ${student.email}`);
        } catch (emailErr) {
          console.error(`[CRON] Error sending email to ${student.email}:`, emailErr);
        }
      }

      // Handle WhatsApp channel (Simulated as requested if Twilio is complex)
      if (reminder.channels.includes("WHATSAPP")) {
        console.log(`[CRON] (Simulated WhatsApp) Message sent to ${student.phone || student.name}: ${reminder.message}`);
      }

      // Mark as sent
      reminder.status = "SENT";
      await reminder.save();
    }
  } catch (error) {
    console.error("[CRON] Scheduler error:", error);
  }
});
