import { useEffect, useState } from "react";
import { gamesService } from "../services/gamesService";
import type { BoardGame } from "../types/BoardGame";
import GameCard from "../components/GameCard";

const GamesPage = () => {
  const [juegos, setJuegos] = useState<BoardGame[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    gamesService
      .getAll()
      .then((listaJuegos) => setJuegos(listaJuegos))
      .catch((respuestaErronea) => {
        setError(
          respuestaErronea.message +
            ": " +
            respuestaErronea.response?.data?.message,
        );
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="juegos-page">
        <p className="juegos-loading">Cargando juegos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="juegos-page">
        <p className="juegos-error">Error: {error}</p>
      </div>
    );
  }

  if (juegos.length === 0) {
    return (
      <div className="juegos-page">
        <p className="juegos-empty">No hay juegos disponibles</p>
      </div>
    );
  }

  return (
    <div className="juegos-page">
      <header className="juegos-header">
        <h1 className="juegos-title">Juegos</h1>
        <p className="juegos-subtitle">Descubre nuestra colección de juegos de mesa</p>
      </header>

      <div className="juegos-grid">
         {juegos.map((juego) => (
        <GameCard juego={juego}/>
         ))}
      </div>
    </div>
  );
};

export default GamesPage;
