import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Si ya está autenticado, redirigir a juegos
  if (isAuthenticated) {
    return <Navigate to="/juegos" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await authService.login({
        email: email.trim(),
        password,
      });
      login(session);
      navigate("/juegos", { replace: true });
    } catch {
      setError("Datos incorrectos o API no disponible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Login</h1>
      <p className="muted">Introduzca sus datos para iniciar sesión</p>

      <form onSubmit={handleSubmit}>
        <div className="form-row login-row">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <p className="muted" style={{ marginTop: "1rem" }}>
                  ¿No tienes cuenta? <Link to="/registro">Registrarse</Link>
                </p>
        </div>
        
      </form>

      {error && <div className="toast error">{error}</div>}
    </section>
  );
}
