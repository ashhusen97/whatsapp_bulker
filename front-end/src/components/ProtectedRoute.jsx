import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles?.includes(user?.role))
    return <Navigate to="/unauthorized" />;

  return <>{children}</>;
};

export default ProtectedRoute;
