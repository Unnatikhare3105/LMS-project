import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/user/login-by-password", {
      email: formData.email,
      password: formData.password
    }).then((response) => {
      console.log("login success fully", response.data);
      if (response.data.success) {
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Login failed: " + response.data.message);
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
    });

    const { email, password } = formData;
    if (!email || !password) {
      return alert("Please fill in all fields.");
    }    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-sm mt-4">
          <Link to="/login-by-otp" className="text-blue-600 underline">
            Login by OTP
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
