const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing

const employerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name is required"], // Validation: Name is mandatory
    trim: true, // Removes leading/trailing spaces
  },
  Email: {
    type: String,
    required: [true, "Email is required"], // Validation: Email is mandatory
    unique: true, // Ensure no duplicates
    lowercase: true, // Always save emails in lowercase
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Email format validation
  },
  Phone: {
    type: String,
    required: [true, "Phone number is required"], // Validation: Phone is mandatory
    unique: true, // Ensure no duplicates
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"], // Phone number format validation
  },
  ProfileUrl: {
    type: String,
    default: null, // Optional field with a default value
  },
  Password: {
    type: String,
    required: [true, "Password is required"], // Validation: Password is mandatory
    minlength: [6, "Password must be at least 6 characters"], // Minimum length validation
  },
});

// Pre-save middleware to hash the password before saving
employerSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});

// Method to compare passwords (for login)
employerSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.Password);
};

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
