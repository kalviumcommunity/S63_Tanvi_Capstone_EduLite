import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      // Optionally handle error
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Successful!</h2>
        <p className="text-gray-600">Redirecting to dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">If you're not redirected automatically, please wait...</p>
      </div>
    </div>
  );
};

export default AuthSuccess; 