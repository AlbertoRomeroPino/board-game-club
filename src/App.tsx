import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import GamesPage from './pages/GamesPage';
import MyGamesPage from './pages/MyGamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Página de inicio pública */}
      <Route path="/inicio" element={<HomePage />} />

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
          <Route path="/juegos" element={<GamesPage />} />
          <Route path="/juegos/:id" element={<GameDetailsPage />} />
          <Route path="/mis-juegos" element={<MyGamesPage />} />
          <Route path="/mis-juegos/:id" element={<GameDetailsPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route index element={<Navigate to="/inicio" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App