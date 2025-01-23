const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Employer = require("../models/Employer");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register Employer
router.post("/register", asyncHandler(async (req, res) => {
  const { Name, Email, Phone, Password } = req.body;

  const employerExists = await Employer.findOne({ Email });
  if (employerExists) {
    res.status(400);
    throw new Error("Employer already exists");
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const employer = await Employer.create({
    Name,
    Email,
    Phone,
    Password: hashedPassword,
  });

  const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({ token, employer });
}));

// Login Employer
router.post("/login", asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;

  const employer = await Employer.findOne({ Email });
  if (!employer || !(await bcrypt.compare(Password, employer.Password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, employer });
}));

// Update Employer Details
router.put("/update", protect, asyncHandler(async (req, res) => {
  const { Name, Email, Phone } = req.body;

  const updatedEmployer = await Employer.findByIdAndUpdate(
    req.user.id,
    { Name, Email, Phone },
    { new: true }
  );

  if (!updatedEmployer) {
    res.status(404);
    throw new Error("Employer not found");
  }

  res.json(updatedEmployer);
}));

// Reset Employer Password
router.put("/resetpassword", protect, asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const employer = await Employer.findById(req.user.id);
  if (!employer || !(await bcrypt.compare(oldPassword, employer.Password))) {
    res.status(401);
    throw new Error("Invalid old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  employer.Password = hashedPassword;
  await employer.save();

  res.json({ message: "Password updated successfully" });
}));

module.exports = router;
