import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    return <Navigate to="/juegos" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/iniciar-sesion", { replace: true });
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar. El email puede estar en uso.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="card">
        <h1>✅ Registro exitoso</h1>
        <p>Tu cuenta ha sido creada. Redirigiendo al login...</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Registro</h1>
      <p className="muted">Crea tu cuenta para unirte al club</p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-row">
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>
      </form>

      {error && <div className="toast error">{error}</div>}

      <p className="muted" style={{ marginTop: "1rem" }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}
