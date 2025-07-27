// src/routes/RoleBasedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";

const RoleBasedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-blue-600">Loading...</div>;
  }

  const hasAccess = requiredRoles.includes(user?.role);

  return hasAccess ? children : <Navigate to="/unauthorized" />;
};

export default RoleBasedRoute;
