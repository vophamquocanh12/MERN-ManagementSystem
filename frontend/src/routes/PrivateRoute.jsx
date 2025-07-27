import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth check finishes
  if (loading) {
    return <div className="text-center mt-20 text-blue-600">Loading...</div>;
  }

  // 🔐 Not logged in? Redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ User is authenticated
  return children;
};

export default PrivateRoute;
