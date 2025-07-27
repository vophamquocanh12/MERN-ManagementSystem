// src/pages/HomeRedirect.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"} replace />;
};

export default HomeRedirect;
