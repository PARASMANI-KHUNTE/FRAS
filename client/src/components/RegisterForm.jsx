import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", file); // Make sure the file field matches the server-side expectation

    try {
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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Register User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
