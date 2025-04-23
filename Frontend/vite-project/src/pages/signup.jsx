import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    if (file) {
      formDataToSend.append("profilePicture", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg mt-20">
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
        <h2 className="text-3xl font-bold text-center text-zinc-800">Student Sign Up</h2>
        <p className="text-xl font-semibold text-stone-500 mb-6 text-center">
          Join EduLite to start your learning journey
        </p>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600">Profile Picture</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mt-1 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-indigo-700 file:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className={`w-full px-6 py-3 mt-4 text-lg font-medium text-white bg-indigo-700 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-700 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
