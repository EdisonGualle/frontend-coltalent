import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, userRole } = useAuth();
  
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
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
  
    return <Outlet />;
  };
  
  export default ProtectedRoute;