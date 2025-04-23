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
    setError(""); // Clear previous errors

    try {
      // const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token); // Save token to localStorage
        alert(response.data.message); // Show success message
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Unexpected error: Login token missing");
      }
    } catch (err) {
      // Enhanced error logging for debugging
      console.error("Login Error:", err.response || err.message);
      setError(err.response?.data?.error || "Failed to login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between bg-white px-6 py-2 shadow-md">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/davztqz5k/image/upload/v1745123371/edulite_logo_figma_lcg648.png"
            alt="EduLite Logo"
            className="object-contain w-10 h-10"
          />
          <span className="ml-2 text-3xl font-bold text-zinc-800">EduLite</span>
        </div>
        <button
          className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-100"
          onClick={() => navigate("/")}
          aria-label="Back to Home"
        >
          Back to Home
        </button>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-zinc-800">Welcome to EduLite</h2>
        <div className="flex justify-center gap-4 mt-6">
          <button className="w-32 px-4 py-2 text-white bg-indigo-700 rounded-lg">Student</button>
          <button className="w-32 px-4 py-2 text-zinc-800 bg-gray-200 rounded-lg">Admin</button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 text-lg font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
          >
            Sign In
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

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
