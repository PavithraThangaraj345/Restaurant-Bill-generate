import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/signin" />;
  }
  return children;
};

export default ProtectedRoute;
