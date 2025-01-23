const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
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
  faceEmbedding: [Number],
  ProfileUrl: {
    type: String,
    default: null, // Optional field with a default value
  },
  Password: {
    type: String,
    required: [true, "Password is required"], // Validation: Password is mandatory
    minlength: [6, "Password must be at least 6 characters"], // Minimum length validation
  },
  Check_in: {
    type: [
      {
        date: {
          type: Date,
          default: Date.now, // Default to current date
        },
        time: {
          type: String, // Store time as string (e.g., "08:00 AM")
          required: true,
        },
      },
    ],
    default: [], // Default to an empty array
  },
  Check_out: {
    type: [
      {
        date: {
          type: Date,
          default: Date.now, // Default to current date
        },
        time: {
          type: String, // Store time as string (e.g., "06:00 PM")
          required: true,
        },
      },
    ],
    default: [], // Default to an empty array
  },
  Shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Night"], // Specify valid shift values
    required: [true, "Shift is required"],
  },
  Task: {
    type: String,
    trim: true, // Removes leading/trailing spaces
    default: "Not Assigned",
  },
  Hours: {
    type: Number,
    default: 0, // Default value for hours worked
  },
  Leaves: {
    type: [
      {
        date: {
          type: Date,
          default: Date.now, // Default to current date
        },
      },
    ],
    default: [], // Default to an empty array
  },
  Employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer", // Reference the Employer collection
    required: [true, "Employer ID is required"],
  },
});

// Pre-save middleware to hash the password before saving
employeeSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});

// Method to compare passwords (for login)
employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.Password);
};


employeeSchema.index({ embedding: 1 });
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
