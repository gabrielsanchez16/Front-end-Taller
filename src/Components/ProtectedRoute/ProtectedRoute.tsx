import { Navigate, Outlet} from 'react-router';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('token'); // O el estado global si usas Context/Redux

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
