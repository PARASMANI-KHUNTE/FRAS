// React Component: AdminLogin.js (Updated Design)
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3200/api/admin/login", formData);
      localStorage.setItem(`token`, data.token);
      setMessage("Logged in successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <section className="h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative  h-screen flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
            <img
              className="object-cover w-full h-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/signup/4/girl-working-on-laptop.jpg"
              alt="Admin Login"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

          <div className="relative">
            <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
              <h3 className="text-4xl font-bold text-white">
                Welcome Back, <br className="hidden xl:block" /> Admin
              </h3>
              <p className="mt-4 text-lg text-gray-300">Securely manage your operations with ease.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Admin Login</h2>
            <p className="mt-2 text-base text-gray-600">
              Don't have an account?{' '}
              <Link
                to={'/adminRegister'}
                className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
              >
                Register Here
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label className="text-base font-medium text-gray-900">{key}</label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        type={key === "Password" ? "password" : "text"}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={`Enter your ${key.toLowerCase()}`}
                        className="block w-full py-4 px-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        required
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-fuchsia-600 to-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80"
                >
                  Login
                </button>
              </div>
            </form>

            {message && <p className="mt-3 text-center text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
