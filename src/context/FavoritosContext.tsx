import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { favoritoService } from "../services/favoritoService";
import { useAuth } from "../auth/authContext";

type FavoritosContextValue = {
  favoriteIds: Set<number>;
  isLoading: boolean;
  isFavorite: (gameId: number) => boolean;
  toggleFavorite: (gameId: number) => Promise<void>;
};

const FavoritosContext = createContext<FavoritosContextValue | undefined>(undefined);

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Cargar favoritos cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      favoritoService
        .getAll()
        .then((favorites) => {
          const ids = new Set(favorites.map((f) => f.gameId));
          setFavoriteIds(ids);
        })
        .catch((err) => {
          console.error("Error al cargar favoritos:", err);
        })
        .finally(() => setIsLoading(false));
    } else {
      setFavoriteIds(new Set());
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback(
    (gameId: number) => favoriteIds.has(gameId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (gameId: number) => {
      if (favoriteIds.has(gameId)) {
        // Quitar de favoritos
        await favoritoService.remove(gameId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(gameId);
          return next;
        });
      } else {
        // Añadir a favoritos
        await favoritoService.add(gameId);
        setFavoriteIds((prev) => new Set(prev).add(gameId));
      }
    },
    [favoriteIds]
  );

  const value = useMemo<FavoritosContextValue>(
    () => ({
      favoriteIds,
      isLoading,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteIds, isLoading, isFavorite, toggleFavorite]
  );

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error("useFavoritos debe usarse dentro de <FavoritosProvider />");
  }
  return context;
}
