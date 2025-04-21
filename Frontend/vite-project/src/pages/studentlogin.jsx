import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      alert(response.data.message); // Login success message
      navigate("/dashboard"); // Redirect to dashboard or another page
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between bg-white px-6 py-2 shadow-md">
  {/* Logo and Title */}
  <div className="flex items-center">
    <img
      src="https://res.cloudinary.com/davztqz5k/image/upload/v1745123371/edulite_logo_figma_lcg648.png" // Replace with your logo URL
      alt="EduLite Logo"
      className="object-contain w-10 h-10"
    />
    <span className="ml-2 text-3xl font-bold text-zinc-800">EduLite</span>

  </div>

  {/* Back to Home Button */}
  <button
    className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-100"
    onClick={() => navigate("/")}
  >
    Back to Home
  </button>
</header>





      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-zinc-800">
          Welcome to EduLite
        </h2>
        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="w-32 px-4 py-2 text-white bg-indigo-700 rounded-lg">
            Student
          </button>
          <button className="w-32 px-4 py-2 text-zinc-800 bg-gray-200 rounded-lg">
            Admin
          </button>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 text-lg font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
          >
            Sign In
          </button>
        </form>

        {/* Or Section */}
        <div className="flex items-center justify-center my-6">
          <div className="w-1/4 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="w-1/4 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-zinc-800 border border-gray-300 rounded-lg hover:bg-gray-100">
          <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-700 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
