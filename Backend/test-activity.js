require('dotenv').config();
const mongoose = require('mongoose');
const ActivityLog = require('./models/ActivityLog');
const User = require('./models/user');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50).populate('userId', 'name role email');
    console.log("Success", logs.length);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}
test();
