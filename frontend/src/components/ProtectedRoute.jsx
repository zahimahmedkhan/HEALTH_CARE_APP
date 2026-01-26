import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute - Wrapper component to protect routes that require authentication
 * Redirects to signin if no access token is found
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Redirect to signin page, but save the attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
