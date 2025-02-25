const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        name: "Admin",
        email: "admin@doorchef.com",
        password: hashedPassword,
        role: "Admin",
      });
      await admin.save();
      console.log("✅ Admin user created successfully!");
    } else {
      console.log("✅ Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
}

module.exports = { createAdmin };
