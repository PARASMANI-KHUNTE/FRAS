const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register Admin
router.post("/register", asyncHandler(async (req, res) => {
  const { Name, Email, Phone, Password } = req.body;

  const adminExists = await Admin.findOne({ Email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ Name, Email, Phone, Password });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({ token, admin });
}));

// Login Admin
router.post("/login", asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;

  const admin = await Admin.findOne({ Email });
  if (!admin || !(await admin.comparePassword(Password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, admin });
}));

// Update Admin Details
router.put("/update", protect, asyncHandler(async (req, res) => {
  const { Name, Email, Phone } = req.body;

  const admin = await Admin.findByIdAndUpdate(req.user.id, { Name, Email, Phone }, { new: true });
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.json(admin);
}));

// Reset Password
router.put("/resetpassword", protect, asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.user.id);
  if (!admin || !(await admin.comparePassword(oldPassword))) {
    res.status(401);
    throw new Error("Invalid old password");
  }

  admin.Password = newPassword;
  await admin.save();

  res.json({ message: "Password updated successfully" });
}));

module.exports = router;
