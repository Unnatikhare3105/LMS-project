import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    verificationMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3000/user/login-by-password", {
        email: formData.email,
        password: formData.password,
      });
      if (res.data.success) {
        setMessage("Login successful!");
        navigate("/syllabus");
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Error during login");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3000/user/register", {
        username: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      if (res.data.success) {
        setMessage("Registration successful! You can now login.");
        setIsLogin(true);
      } else {
        setMessage(res.data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Error during registration");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l font-semibold flex items-center gap-2 ${isLogin ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setIsLogin(true)}
          >
            <i className="ri-login-box-line"></i> Login
          </button>
          <button
            className={`px-4 py-2 rounded-r font-semibold flex items-center gap-2 ${!isLogin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setIsLogin(false)}
          >
            <i className="ri-user-add-line"></i> Signup
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-mail-line"></i> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-lock-line"></i> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
            >
              <i className="ri-login-box-line"></i> {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-user-line"></i> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-phone-line"></i> Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-mail-line"></i> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                <i className="ri-lock-line"></i> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
            >
              <i className="ri-user-add-line"></i> {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
        )}
        {message && <p className="mt-4 text-center text-red-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default LoginSignup;
