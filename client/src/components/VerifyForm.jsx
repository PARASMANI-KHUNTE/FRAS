import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyForm = () => {
  const [file, setFile] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
  
    if (!file) {
      toast.error("Please upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      // Sending image to the server for face verification
      const response = await axios.post("http://localhost:3000/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Log the full server response for debugging
      console.log("Server Response:", response.data);
  
      if (response.status === 200) {
        toast.success(
          `${response.data.message}`
        );
  
      
      } else {
        toast.error("Face not recognized or server error occurred.");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with an error status
        toast.error(err.response.data || "Verification failed.");
      } else {
        // Network or other errors
        toast.error("Error verifying user.");
      }
      console.error("Error during verification:", err);
    }
  };
  

  return (
    <form className="flex flex-col gap-4" onSubmit={handleVerify}>
      <h2 className="text-2xl font-bold">Verify User</h2>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Verify
      </button>
    </form>
  );
};

export default VerifyForm;
