import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/authContext";

// Protege rutas que requieren autenticación
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return <Outlet />;
}

// Redirige a /juegos si ya está autenticado (para login/register)
export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/juegos" replace />;
  }

  return <Outlet />;
}
