import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First, check if backend is reachable
      try {
        await axios.get('http://localhost:5000/');
      } catch (err) {
        throw new Error('Backend server is not running. Please start the server and try again.');
      }

      console.log("Attempting admin login with:", { email });
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      }, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        console.error("No token in response:", response.data);
        setError("Unexpected error: Login token missing");
      }
    } catch (err) {
      console.error("Login Error Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      if (err.message.includes('Backend server is not running')) {
        setError(err.message);
      } else if (err.message === 'Network Error') {
        setError("Cannot connect to the server. Please make sure the backend server is running on http://localhost:5000");
      } else if (err.code === 'ECONNABORTED') {
        setError("Connection timed out. Please try again.");
      } else {
        setError(err.response?.data?.error || "Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
        >
          Back to Home
        </button>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-zinc-800">Admin Login</h2>
        <p className="mt-2 text-center text-gray-600">Access the admin dashboard</p>

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

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
              placeholder="admin@edulite.com"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 text-lg font-medium text-white bg-indigo-700 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 