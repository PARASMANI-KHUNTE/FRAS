// React Component: ResetPassword.js
import  { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3200/api/admin/resetpassword", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <label className="block mb-1 capitalize">{key}</label>
            <input
              type="password"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        ))}
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Reset Password</button>
      </form>
      {message && <p className="mt-3 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default ResetPassword;
