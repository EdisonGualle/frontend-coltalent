import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status" className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce animation-delay-200"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;