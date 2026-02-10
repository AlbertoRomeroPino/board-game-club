import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <header className="navbar">
        <div className="navbar-inner">
          <span className="brand">🎲 Board Game Club</span>
          <nav className="navlinks">
            <NavLink to="/inicio">Inicio</NavLink>
            <NavLink to="/juegos">Juegos</NavLink>
            {isAuthenticated && user && (
              <NavLink to="/mis-juegos">Mis Juegos</NavLink>
            )}
            {isAuthenticated && user && (
              <NavLink to="/favoritos">Favoritos</NavLink>
            )}
            {isAuthenticated && user && (
              <NavLink to="/perfil">Perfil</NavLink>
            )}
            {isAuthenticated && user && (
              <>
                <div className="nav-username">
                  <span className="username-message">Usuario:</span>
                  <span className="username-name">{user.name}</span>
                </div>
                <button className="nav-btn logout" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
