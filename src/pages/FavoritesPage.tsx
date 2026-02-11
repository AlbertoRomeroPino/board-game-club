import { useEffect, useState } from 'react';
import { favoriteService } from '../services/favoriteService';
import type { FavoriteWithGame } from '../types/Favorite';
import GameCard from '../components/GameCard';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const [favoritos, setFavoritos] = useState<FavoriteWithGame[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    favoriteService
      .getAll()
      .then((data) => setFavoritos(data))
      .catch((err) => {
        console.error('Error al cargar los favoritos:', err);
        setError('No se pudieron cargar los favoritos');
      })
      .finally(() => setCargando(false));
  }, []);

  // Filtrar favoritos que ya no están en el contexto global
  const favoritosActuales = favoritos.filter((f) => favoriteIds.has(f.gameId));

  if (cargando) {
    return <div className="juegos-page"><p>Cargando favoritos...</p></div>;
  }

  return (
    <div className="juegos-page">
      <header className="juegos-header">
        <h1 className="juegos-title">Mis Favoritos</h1>
      </header>

      {error && <p className="error-message">{error}</p>}

      {favoritosActuales.length === 0 ? (
        <p className="empty-state">No tienes juegos en favoritos aún.</p>
      ) : (
        <div className="juegos-grid">
          {favoritosActuales.map((favorito) =>
            favorito.game ? (
              <GameCard key={favorito.id} juego={favorito.game} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
