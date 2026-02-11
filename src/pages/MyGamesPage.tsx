import { useEffect, useState } from "react";
import type { BoardGame, CreateBoardGame } from "../types/BoardGame";
import { gamesService } from "../services/gamesService";
import GameCard from "../components/GameCard";
import GameForm from "../components/GameForm";

const MyGamesPage = () => {
  const [misJuegos, setMisJuegos] = useState<BoardGame[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gamesService
      .getAllByUser()
      .then((juegos) => setMisJuegos(juegos))
      .catch((err) => {
        console.error("Error al obtener los juegos del usuario:", err);
        setError("No se pudieron cargar tus juegos");
      })
      .finally(() => setCargandoInicial(false));
  }, []);

  const handleAgregarJuego = (nuevoJuego: CreateBoardGame) => {
    setIsLoading(true);
    gamesService
      .create(nuevoJuego as BoardGame)
      .then((juegoCreado) => {
        setMisJuegos((prev) => [...prev, juegoCreado]);
        setMostrarFormulario(false);
      })
      .catch((err) => {
        console.error("Error al crear el juego:", err);
        setError("No se pudo crear el juego");
      })
      .finally(() => setIsLoading(false));
  };

  if (cargandoInicial) {
    return (
      <div className="juegos-page">
        <p>Cargando tus juegos...</p>
      </div>
    );
  }

  return (
    <div className="juegos-page">
      <header className="juegos-header">
        <h1 className="juegos-title">Mis Juegos</h1>
        <button
          className="btn-primary"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar Juego"}
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {mostrarFormulario ? (
        <GameForm onSubmit={handleAgregarJuego} isLoading={isLoading} />
      ) : misJuegos.length === 0 ? (
        <p className="empty-state">No tienes juegos aún. ¡Añade tu primer juego!</p>
      ) : (
        <div className="juegos-grid">
          {misJuegos.map((juego) => (
            <GameCard key={juego.id} juego={juego} isOwner />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGamesPage;
