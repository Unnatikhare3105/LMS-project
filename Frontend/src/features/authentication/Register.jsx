import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    verificationMethod: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/user/register", {
      username: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      verificationMethod: formData.verificationMethod,
    }).then((response) => {
      console.log("signup success fully", response.data);
      if (response.data.success) {
        alert("Registration successful! Please verify your account.");
        navigate("/verify-otp");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    })
    .catch((error) => {
      console.error("Error during registration:", error);
    });

    const { fullName, mobile, email, password } = formData;
    if (!fullName || !mobile || !email || !password) {
      return alert("Please fill in all fields.");
    }    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

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

          <div className="mb-2">
            <select
              name="verificationMethod"
              value={formData.verificationMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">verification Method</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
          
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
