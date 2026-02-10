import { useEffect, useState } from "react";
import type { BoardGame, CreateBoardGame } from "../types/BoardGame";
import { juegosService } from "../services/juegosService";
import JuegoCard from "../components/JuegoCard";
import JuegosForm from "../components/JuegosForm";

const MisJuegos = () => {
  const [misJuegos, setMisJuegos] = useState<BoardGame[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    juegosService
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
    juegosService
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
        <JuegosForm onSubmit={handleAgregarJuego} isLoading={isLoading} />
      ) : misJuegos.length === 0 ? (
        <p className="empty-state">No tienes juegos aún. ¡Añade tu primer juego!</p>
      ) : (
        <div className="juegos-grid">
          {misJuegos.map((juego) => (
            <JuegoCard key={juego.id} juego={juego} clickable />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisJuegos;
