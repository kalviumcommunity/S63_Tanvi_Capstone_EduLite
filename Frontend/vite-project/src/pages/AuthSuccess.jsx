import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    console.log('AuthSuccess: Token received:', token ? 'Yes' : 'No');
    console.log('AuthSuccess: Error received:', error || 'None');

    if (error) {
      console.error('Google auth error:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (token) {
      console.log('AuthSuccess: Storing token and redirecting to dashboard');
      // Store the token
      localStorage.setItem('token', token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      console.log('AuthSuccess: No token received, redirecting to login');
      // No token received, redirect to login
      navigate('/login?error=No authentication token received');
    }
  }, [searchParams, navigate]);

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