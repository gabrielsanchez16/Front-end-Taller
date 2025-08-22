// ProtectedLayout.tsx
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import NotSubscribed from "../../Views/NotSubscribed/NotSubscribed"; // Ajusta la ruta si es necesario
import { useAuth } from "../../hooks/useAuth";


const ProtectedLayout = () => {
  const { isAuthenticated, user,loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/home");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  if (!user?.suscription) {
    return <NotSubscribed />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
