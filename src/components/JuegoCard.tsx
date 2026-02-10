import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BoardGame } from '../types/BoardGame';
import { useFavoritos } from '../context/FavoritosContext';

interface JuegoCardProps {
    juego: BoardGame;
    clickable?: boolean;
    showFavoriteButton?: boolean;
}


const JuegoCard = ({ juego, clickable = false, showFavoriteButton = true }: JuegoCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritos();
  const [isToggling, setIsToggling] = useState(false);

  const esFavorito = isFavorite(juego.id);

  const handleClick = () => {
    if (clickable) {
      navigate(`/mis-juegos/${juego.id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se dispare el click de navegación
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleFavorite(juego.id);
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default' }}>
     
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
              {showFavoriteButton && (
                <button
                  className={`juego-card__favorite ${esFavorito ? 'juego-card__favorite--active' : ''}`}
                  onClick={handleFavoriteClick}
                  disabled={isToggling}
                  title={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  {esFavorito ? '★' : '☆'}
                </button>
              )}
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
       
    </div>
  )
}

export default JuegoCard
