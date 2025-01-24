const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Employee = require("../models/Employee");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const canvas = require("canvas");
const router = express.Router();

// const faceapi = require("@vladmandic/face-api");

// const router = express.Router();

// // Configure Multer for image uploads
// const upload = multer({ dest: "uploads/" });

// // Load Face-api models
// const MODEL_PATH = path.join(__dirname, "./face-api.js-master/weights");
// async function loadModels() {
//   if (!fs.existsSync(MODEL_PATH)) {
//     console.error("Model path does not exist:", MODEL_PATH);
//     process.exit(1);
//   }
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
//   await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
//   console.log("Face-api models loaded successfully.");
// }
// loadModels(); // Load models when the server starts

// // Utility function to calculate distance between embeddings
// function calculateDistance(embedding1, embedding2) {
//   return Math.sqrt(
//     embedding1.reduce((sum, val, i) => sum + (val - embedding2[i]) ** 2, 0)
//   );
// }

// // Register Employee with Face Recognition
// router.post(
//   "/register",
//   upload.single("image"),
//   asyncHandler(async (req, res) => {
//     const { Name, Email, Phone, Password, Shift, Task } = req.body;

//     // Check if the employee already exists (by email)
//     const employeeExists = await Employee.findOne({ Email });
//     if (employeeExists) {
//       res.status(400);
//       throw new Error("Employee with this email already exists.");
//     }

//     if (!req.file) {
//       res.status(400);
//       throw new Error("Profile image is required for registration.");
//     }

//     const filePath = req.file.path;

//     try {
//       const img = await canvas.loadImage(filePath);
//       const detections = await faceapi
//         .detectSingleFace(img)
//         .withFaceLandmarks()
//         .withFaceDescriptor();

//       if (!detections) {
//         res.status(400);
//         throw new Error("No face detected. Please provide a clear image.");
//       }

//       const faceEmbedding = Array.from(detections.descriptor);

//       // Check for duplicate face embeddings
//       const employees = await Employee.find({ faceEmbedding: { $exists: true } });
//       for (const employee of employees) {
//         const distance = calculateDistance(employee.faceEmbedding, faceEmbedding);
//         if (distance < 0.6) {
//           res.status(400);
//           throw new Error("Face already registered. Please use a different face.");
//         }
//       }

//       const hashedPassword = await bcrypt.hash(Password, 10);

//       // Create a new employee
//       const employee = await Employee.create({
//         Name,
//         Email,
//         Phone,
//         Password: hashedPassword,
//         Shift,
//         Task,
//         faceEmbedding,
//         ProfileUrl: `/uploads/${req.file.filename}`,
//       });

//       const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });

//       res.status(201).json({ token, employee });
//     } catch (error) {
//       console.error("Error during registration:", error);
//       res.status(500);
//       throw new Error("Face registration failed.");
//     } finally {
//       // Clean up uploaded file
//       fs.promises.unlink(filePath).catch((err) =>
//         console.error("Error cleaning up file:", err)
//       );
//     }
//   })
// );

// // Login Employee with Credentials or Face Recognition
// router.post(
//     "/login",
//     upload.single("image"),
//     asyncHandler(async (req, res) => {
//       const { Email, Password } = req.body; // Credentials
//       const filePath = req.file ? req.file.path : null; // Face image (if provided)
  
//       try {
//         if (Email && Password) {
//           // Login using email and password
//           const employee = await Employee.findOne({ Email });
//           if (!employee || !(await bcrypt.compare(Password, employee.Password))) {
//             res.status(401);
//             throw new Error("Invalid email or password.");
//           }
  
//           const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//           });
  
//           return res.json({ token, employee });
//         } else if (filePath) {
//           // Login using face recognition
//           const img = await canvas.loadImage(filePath);
//           const detections = await faceapi
//             .detectSingleFace(img)
//             .withFaceLandmarks()
//             .withFaceDescriptor();
  
//           if (!detections) {
//             res.status(400);
//             throw new Error("No face detected. Please provide a clear image.");
//           }
  
//           const newEmbedding = Array.from(detections.descriptor);
  
//           // Search for a matching face in the database
//           const employees = await Employee.find({ faceEmbedding: { $exists: true } });
//           let bestMatch = null;
//           let bestDistance = Infinity;
  
//           for (const employee of employees) {
//             const distance = calculateDistance(employee.faceEmbedding, newEmbedding);
//             if (distance < bestDistance) {
//               bestDistance = distance;
//               bestMatch = employee;
//             }
//           }
  
//           const THRESHOLD = 0.6; // Adjust as necessary
//           if (bestMatch && bestDistance < THRESHOLD) {
//             const token = jwt.sign({ id: bestMatch._id }, process.env.JWT_SECRET, {
//               expiresIn: "1h",
//             });
//             return res.json({ token, employee: bestMatch });
//           } else {
//             res.status(401);
//             throw new Error("Face does not match any registered user.");
//           }
//         } else {
//           // No credentials or face image provided
//           res.status(400);
//           throw new Error("Either credentials or face image must be provided for login.");
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).send("Login failed.");
//       } finally {
//         // Clean up the uploaded file if it exists
//         if (filePath) {
//           fs.promises.unlink(filePath).catch((err) =>
//             console.error("Error cleaning up file:", err)
//           );
//         }
//       }
//     })
//   );
  

// // Check-in Route
// router.post(
//     "/check-in",
//     upload.single("image"),
//     asyncHandler(async (req, res) => {
//       if (!req.file) {
//         res.status(400);
//         throw new Error("Face image is required for check-in.");
//       }
  
//       const filePath = req.file.path;
  
//       try {
//         const img = await canvas.loadImage(filePath);
//         const detections = await faceapi
//           .detectSingleFace(img)
//           .withFaceLandmarks()
//           .withFaceDescriptor();
  
//         if (!detections) {
//           res.status(400);
//           throw new Error("No face detected. Please provide a clear image.");
//         }
  
//         const newEmbedding = Array.from(detections.descriptor);
  
//         // Find the best matching employee
//         const employees = await Employee.find({ faceEmbedding: { $exists: true } });
//         let bestMatch = null;
//         let bestDistance = Infinity;
  
//         for (const employee of employees) {
//           const distance = calculateDistance(employee.faceEmbedding, newEmbedding);
//           if (distance < bestDistance) {
//             bestDistance = distance;
//             bestMatch = employee;
//           }
//         }
  
//         const THRESHOLD = 0.6;
//         if (bestMatch && bestDistance < THRESHOLD) {
//           // Verify if already checked in
//           const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
//           const alreadyCheckedIn = bestMatch.Check_in.some(
//             (check) => check.date.toISOString().split("T")[0] === today
//           );
  
//           if (alreadyCheckedIn) {
//             res.status(400);
//             throw new Error("Employee already checked in for the day.");
//           }
  
//           // Add check-in time
//           bestMatch.Check_in.push({
//             date: new Date(),
//             time: new Date().toLocaleTimeString(),
//           });
//           await bestMatch.save();
  
//           return res.json({
//             message: "Check-in successful.",
//             employee: bestMatch,
//           });
//         } else {
//           res.status(401);
//           throw new Error("Face does not match any registered user.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         res.status(500).send("Check-in failed.");
//       } finally {
//         // Clean up the uploaded file
//         fs.promises.unlink(filePath).catch((err) =>
//           console.error("Error cleaning up file:", err)
//         );
//       }
//     })
//   );
  
  // // Check-out Route
  // router.post(
  //   "/check-out",
  //   upload.single("image"),
  //   asyncHandler(async (req, res) => {
  //     if (!req.file) {
  //       res.status(400);
  //       throw new Error("Face image is required for check-out.");
  //     }
  
  //     const filePath = req.file.path;
  
  //     try {
  //       const img = await canvas.loadImage(filePath);
  //       const detections = await faceapi
  //         .detectSingleFace(img)
  //         .withFaceLandmarks()
  //         .withFaceDescriptor();
  
  //       if (!detections) {
  //         res.status(400);
  //         throw new Error("No face detected. Please provide a clear image.");
  //       }
  
  //       const newEmbedding = Array.from(detections.descriptor);
  
  //       // Find the best matching employee
  //       const employees = await Employee.find({ faceEmbedding: { $exists: true } });
  //       let bestMatch = null;
  //       let bestDistance = Infinity;
  
  //       for (const employee of employees) {
  //         const distance = calculateDistance(employee.faceEmbedding, newEmbedding);
  //         if (distance < bestDistance) {
  //           bestDistance = distance;
  //           bestMatch = employee;
  //         }
  //       }
  
  //       const THRESHOLD = 0.6;
  //       if (bestMatch && bestDistance < THRESHOLD) {
  //         // Verify if the employee has checked in but not checked out
  //         const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  //         const alreadyCheckedIn = bestMatch.Check_in.some(
  //           (check) => check.date.toISOString().split("T")[0] === today
  //         );
  //         const alreadyCheckedOut = bestMatch.Check_out.some(
  //           (check) => check.date.toISOString().split("T")[0] === today
  //         );
  
  //         if (!alreadyCheckedIn) {
  //           res.status(400);
  //           throw new Error("Employee has not checked in today.");
  //         }
  
  //         if (alreadyCheckedOut) {
  //           res.status(400);
  //           throw new Error("Employee already checked out for the day.");
  //         }
  
  //         // Add check-out time
  //         bestMatch.Check_out.push({
  //           date: new Date(),
  //           time: new Date().toLocaleTimeString(),
  //         });
  //         await bestMatch.save();
  
  //         return res.json({
  //           message: "Check-out successful.",
  //           employee: bestMatch,
  //         });
  //       } else {
  //         res.status(401);
  //         throw new Error("Face does not match any registered user.");
  //       }
  //     } catch (error) {
  //       console.error("Error during check-out:", error);
  //       res.status(500).send("Check-out failed.");
  //     } finally {
  //       // Clean up the uploaded file
  //       fs.promises.unlink(filePath).catch((err) =>
  //         console.error("Error cleaning up file:", err)
  //       );
  //     }
  //   })
  // );
  


// Update Employee Details (No changes needed for face recognition)
router.put(
  "/update",
  protect,
  asyncHandler(async (req, res) => {
    const { Name, Email, Phone, Shift, Task } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.user.id,
      { Name, Email, Phone, Shift, Task },
      { new: true }
    );

    if (!updatedEmployee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    res.json(updatedEmployee);
  })
);

// Reset Employee Password (No changes needed for face recognition)
router.put(
  "/resetpassword",
  protect,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const employee = await Employee.findById(req.user.id);
    if (!employee || !(await bcrypt.compare(oldPassword, employee.Password))) {
      res.status(401);
      throw new Error("Invalid old password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.Password = hashedPassword;
    await employee.save();

    res.json({ message: "Password updated successfully" });
  })
);




module.exports = router;
