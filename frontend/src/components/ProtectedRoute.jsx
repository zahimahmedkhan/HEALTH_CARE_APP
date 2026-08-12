import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute - Wrapper component to protect routes that require authentication
 * Redirects to signin if no access token is found
 * Optionally supports allowedRoles prop (array of role strings).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const reduxUser = useSelector((state) => state.user?.currentUser);
  const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const currentUser = reduxUser || storedUser;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no role restriction specified, allow
  if (!allowedRoles || allowedRoles.length === 0) return children;

  try {
    // Try to decode simple JWT payload to read role info
    const parts = token.split('.');
    if (parts.length < 2) return <Navigate to="/" replace />;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    const role = payload?.role || payload?.roles || payload?.user?.role || null;

    if (Array.isArray(role)) {
      const has = role.some((r) => allowedRoles.includes(r));
      if (!has) return <Navigate to="/" replace />;
    } else if (typeof role === 'string') {
      if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
    } else {
      // No role info in token - block access to role protected route
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error('ProtectedRoute role check failed', err);
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
