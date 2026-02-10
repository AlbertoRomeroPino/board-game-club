import { useEffect, useState } from "react";
import { juegosService } from "../services/juegosService";
import type { BoardGame } from "../types/BoardGame";

const JuegosPage = () => {
  const [juegos, setJuegos] = useState<BoardGame[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    juegosService
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
          <article key={juego.id} className="juego-card">
            <div className="juego-card__image-container">
              <img 
                src={juego.imageUrl} 
                alt={juego.title} 
                className="juego-card__image"
              />
              <span className="juego-card__rating">
                ⭐ {juego.rating}
              </span>
            </div>
            
            <div className="juego-card__content">
              <h2 className="juego-card__title">{juego.title}</h2>
              <p className="juego-card__description">{juego.description}</p>
              
              <div className="juego-card__details">
                <span className="juego-card__detail">
                  <span className="juego-card__detail-icon">👥</span>
                  {juego.minPlayers} - {juego.maxPlayers}
                </span>
                <span className="juego-card__detail">
                  <span className="juego-card__detail-icon">⏱️</span>
                  {juego.playTime} min
                </span>
              </div>

              <div className="juego-card__categories">
                {juego.category.map((cat) => (
                  <span key={cat} className="juego-card__category">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default JuegosPage;
