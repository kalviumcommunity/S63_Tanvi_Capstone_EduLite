const mongoose = require("mongoose");
const User = require("./models/user");
const Admin = require("./models/admin");

async function migrateAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://tanviagarwals63:1234tanvi@edulite.9zovzao.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users to migrate`);

    // Migrate each admin user
    for (const adminUser of adminUsers) {
      console.log(`Migrating admin: ${adminUser.email}`);
      
      // Check if admin already exists in Admin collection
      const existingAdmin = await Admin.findOne({ email: adminUser.email });
      
      if (!existingAdmin) {
        // Create new admin in Admin collection
        const newAdmin = new Admin({
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password // Password is already hashed
        });

        await newAdmin.save();
        console.log(`Successfully migrated admin: ${adminUser.email}`);
      } else {
        console.log(`Admin already exists: ${adminUser.email}`);
      }
    }

    console.log("Migration completed successfully");

  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    process.exit(0);
  }
}

migrateAdmin(); 