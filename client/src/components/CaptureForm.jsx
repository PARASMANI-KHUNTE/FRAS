import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CaptureForm = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [name, setName] = useState("");
  const [mode, setMode] = useState(null); // "register" or "verify"

  useEffect(() => {
    if (mode) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Unable to access camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  };

  const handleRegister = async () => {
    if (!name) {
      toast.error("Please enter a name.");
      return;
    }

    const imageData = captureImage();
    if (!imageData) {
      toast.error("Failed to capture image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", dataURLtoBlob(imageData));

      const response = await axios.post("http://localhost:3000/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("User registered successfully!");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Error registering user.");
    }
  };

  const handleVerify = async () => {
    const imageData = captureImage();
    if (!imageData) {
      toast.error("Failed to capture image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", dataURLtoBlob(imageData));

      const response = await axios.post("http://localhost:3000/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 ) {
        toast.success(response.data.message);
       
      } else {
        toast.error("Face not recognized.");
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data || "Verification failed.");
      } else {
        toast.error("Error verifying user.");
      }
      console.error(err);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const [header, base64] = dataURL.split(",");
    const mimeString = header.split(":")[1].split(";")[0];
    const byteString = atob(base64);
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-bold">User Management</h2>
      <div className="flex gap-2">
        <button
          onClick={() => setMode("register")}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
        <button
          onClick={() => setMode("verify")}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Verify
        </button>
      </div>
      {mode === "register" && (
        <div className="flex flex-col gap-2 items-center">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-full max-w-md"
          />
          <button
            onClick={handleRegister}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Register User
          </button>
        </div>
      )}
      {mode && (
        <div className="flex flex-col gap-4 items-center">
          <video ref={videoRef} autoPlay className="border rounded w-full max-w-md" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {mode === "verify" && (
        <button
          onClick={handleVerify}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Verify User
        </button>
      )}
    </div>
  );
};

export default CaptureForm;
