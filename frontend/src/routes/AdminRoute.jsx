import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/employee-dashboard" replace />;

  return children;
};

export default AdminRoute;
