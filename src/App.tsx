import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { InicioPage } from './pages/InicioPage';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import PerfilPage from './pages/PerfilPage';
import JuegosPage from './pages/JuegosPage';
import MisJuegos from './pages/MisJuegos';

function App() {
  return (
    <Routes>
      {/* Página de inicio pública */}
      <Route path="/inicio" element={<InicioPage />} />

      {/* Rutas de autenticación (sin navbar, solo para no autenticados) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Rutas protegidas (con navbar, solo para autenticados) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/juegos" element={<JuegosPage />} />
          <Route path="/mis-juegos" element={<MisJuegos />} />
          <Route path="/favoritos" element={<div>Favoritos (TODO)</div>} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route index element={<Navigate to="/inicio" replace />} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App