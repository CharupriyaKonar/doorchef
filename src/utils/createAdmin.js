const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin123" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new Admin({
        email: "admin@doorchef.com",
        password: hashedPassword,
      });
      await admin.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
}

module.exports = createAdmin;
