const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const faceapi = require('face-api.js');
const canvas = require('canvas');
const mongoose = require("mongoose");
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const PORT = 3000;
const THRESHOLD = 0.6;
const UPLOAD_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});
app.use(limiter);

// MongoDB connection and schema
mongoose.connect("mongodb://localhost:27017/face_recognition")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  embedding: [Number],
});
UserSchema.index({ embedding: 1 });
const User = mongoose.model("User", UserSchema);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMIT },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG files are allowed."));
    }
    cb(null, true);
  },
});

// Load face-api models
const MODEL_PATH = path.join(__dirname, "./face-api.js-master/weights");
async function loadModels() {
  if (!fs.existsSync(MODEL_PATH)) {
    console.error("Model path does not exist:", MODEL_PATH);
    process.exit(1);
  }
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  console.log("Face-api models loaded successfully.");
}
loadModels();

// Calculate Euclidean distance between two embeddings
const calculateDistance = (embedding1, embedding2) => {
  return Math.sqrt(
    embedding1.reduce((sum, value, index) => sum + (value - embedding2[index]) ** 2, 0)
  );
};

// Route to register a new user
app.post("/register", uploadMiddleware.single("image"), async (req, res) => {
  const { name } = req.body;
  const filePath = req.file.path;

  try {
    const img = await canvas.loadImage(filePath);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      return res.status(400).send("No face detected.");
    }

    const embedding = Array.from(detections.descriptor);
    const user = new User({ name, embedding });
    await user.save();

    console.log(`User ${name} registered successfully.`);
    res.json({ success: true, message: `User ${name} registered.` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Error during registration.");
  } finally {
    fs.promises.unlink(filePath).catch((err) => console.error("Error cleaning up file:", err));
  }
});

// Route to verify a user
app.post("/verify", uploadMiddleware.single("image"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const img = await canvas.loadImage(filePath);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      return res.status(400).send("No face detected.");
    }

    const newEmbedding = Array.from(detections.descriptor);
    const users = await User.find({});
    let bestMatch = null;
    let bestDistance = Infinity;

    users.forEach((user) => {
      const distance = calculateDistance(user.embedding, newEmbedding);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    });

    if (bestDistance < THRESHOLD) {

      console.log(`User ${bestMatch.name} verified.`);
      res.json({ success: true, message: `User ${bestMatch.name} verified.` });
    } else {
      res.json({ success: false, message: "No matching user found." });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).send("Error during verification.");
  } finally {
    fs.promises.unlink(filePath).catch((err) => console.error("Error cleaning up file:", err));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
