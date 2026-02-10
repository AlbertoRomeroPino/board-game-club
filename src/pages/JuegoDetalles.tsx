import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { juegosService } from "../services/juegosService";
import JuegosForm from "../components/JuegosForm";
import type { BoardGame, CreateBoardGame } from "../types/BoardGame";

const JuegoDetalles = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [juego, setJuego] = useState<BoardGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (id) {
      juegosService
        .get(Number(id))
        .then((data) => setJuego(data))
        .catch((err) => {
          console.error("Error al cargar el juego:", err);
          setError("No se pudo cargar el juego");
        });
    }
  }, [id]);

  const handleSubmit = (juegoActualizado: CreateBoardGame) => {
    if (!id || !juego) return;
    setIsLoading(true);
    const juegoCompleto: BoardGame = {
      ...juegoActualizado,
      id: juego.id,
      userId: juego.userId,
      createdAt: juego.createdAt,
    };
    juegosService
      .update(juegoCompleto)
      .then((actualizado) => {
        setJuego(actualizado);
        setModoEdicion(false);
      })
      .catch((err) => {
        console.error("Error al actualizar el juego:", err);
        setError("No se pudo actualizar el juego");
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = () => {
    if (!id || !juego) return;
    if (
      !window.confirm(`¿Estás seguro de que quieres eliminar "${juego.title}"?`)
    )
      return;

    setIsLoading(true);
    juegosService
      .delete(Number(id))
      .then(() => {
        navigate("/mis-juegos");
      })
      .catch((err) => {
        console.error("Error al eliminar el juego:", err);
        setError("No se pudo eliminar el juego");
      })
      .finally(() => setIsLoading(false));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!juego) {
    return <div>Cargando...</div>;
  }

  if (modoEdicion) {
    return (
      <div className="juegos-page">
        <header className="juegos-header">
          <h1 className="juegos-title">Editar Juego</h1>
          <button
            className="btn-secondary"
            onClick={() => setModoEdicion(false)}
          >
            Cancelar
          </button>
        </header>
        <JuegosForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={juego}
        />
      </div>
    );
  }

  return (
    <div className="juegos-page">
      <header className="juegos-header">
        <h1 className="juegos-title">Detalles del Juego</h1>
        <button
          className="btn-secondary"
          onClick={() => navigate("/mis-juegos")}
        >
          Volver
        </button>
      </header>

      <div className="juego-detalles">
        <div className="juego-detalles__imagen">
          <img src={juego.imageUrl} alt={juego.title} />
        </div>

        <div className="juego-detalles__info">
          <h2 className="juego-detalles__titulo">{juego.title}</h2>

          <div className="juego-detalles__rating">⭐ {juego.rating}/10</div>

          <p className="juego-detalles__descripcion">{juego.description}</p>

          <div className="juego-detalles__metadata">
            <div className="juego-detalles__meta-item">
              <span className="meta-label">Jugadores:</span>
              <span className="meta-value">
                {juego.minPlayers} - {juego.maxPlayers}
              </span>
            </div>
            <div className="juego-detalles__meta-item">
              <span className="meta-label">Tiempo de juego:</span>
              <span className="meta-value">{juego.playTime} minutos</span>
            </div>
            <div className="juego-detalles__meta-item">
              <span className="meta-label">Fecha de creación:</span>
              <span className="meta-value">
                {new Date(juego.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="juego-detalles__categorias">
            <span className="meta-label">Categorías:</span>
            <div className="categorias-list">
              {juego.category.map((cat) => (
                <span key={cat} className="juego-card__category">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="juego-detalles__acciones">
            <button
              className="btn-primary"
              onClick={() => setModoEdicion(true)}
              disabled={isLoading}
            >
              Editar
            </button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuegoDetalles;
