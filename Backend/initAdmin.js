const mongoose = require("mongoose");
const Admin = require("./models/admin");
const bcrypt = require("bcryptjs");

// Admin credentials
const adminData = {
  name: "Admin",
  email: "admin@edulite.com",
  password: "EduLite@2024"
};

async function initAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://tanviagarwals63:1234tanvi@edulite.9zovzao.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // First, delete any existing admin user to start fresh
    await Admin.deleteMany({ email: adminData.email });
    console.log("Cleaned up any existing admin users");

    // Create admin user - let the Admin model handle password hashing
    console.log("Creating admin user...");
    const admin = new Admin({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);

    // Verify the password was hashed correctly
    const savedAdmin = await Admin.findOne({ email: adminData.email });
    const isMatch = await bcrypt.compare(adminData.password, savedAdmin.password);
    console.log("Password verification:", isMatch ? "Success" : "Failed");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

initAdmin(); 