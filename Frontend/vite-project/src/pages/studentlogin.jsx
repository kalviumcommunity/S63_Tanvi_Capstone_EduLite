import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle Google auth success
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
    
    if (error) {
      handleGoogleLoginError(error);
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Unexpected error: Login token missing");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError("");
    
    // Redirect to Google OAuth
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGoogleLoginError = (error) => {
    setIsGoogleLoading(false);
    if (error.includes('not configured')) {
      setError("Google login is currently unavailable. Please use email and date of birth to sign in.");
    } else {
      setError("Google authentication failed. Please try again or use email login.");
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

        {/* Instructions */}
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            Please use the email and date of birth (YYYY-MM-DD) provided by your administrator to log in, or sign in with Google.
          </p>
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
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
              Date of Birth (YYYY-MM-DD)
            </label>
            <input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your date of birth (YYYY-MM-DD)"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 mt-4 text-lg font-medium text-white bg-indigo-700 rounded-lg ${
              isLoading || isGoogleLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-800"
            }`}
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

        {/* Or Section */}
        <div className="flex items-center justify-center my-6">
          <div className="w-1/4 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="w-1/4 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-zinc-800 border border-gray-300 rounded-lg transition-colors ${
            isLoading || isGoogleLoading 
              ? "opacity-50 cursor-not-allowed bg-gray-100" 
              : "hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {isGoogleLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin mr-2"></div>
              Connecting to Google...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
