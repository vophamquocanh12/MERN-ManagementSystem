import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const EmployeeRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'employee') return <Navigate to="/admin-dashboard" replace />;

  return children;
};

export default EmployeeRoute;
