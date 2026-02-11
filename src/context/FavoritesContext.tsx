import { createContext, useCallback, useContext, useEffect, useMemo, useState, startTransition } from "react";
import { favoriteService } from "../services/favoriteService";
import { useAuth } from "../auth/authContext";

type FavoritesContextValue = {
  favoriteIds: Set<number>;
  isLoading: boolean;
  isFavorite: (gameId: number) => boolean;
  toggleFavorite: (gameId: number) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  // Cargar favoritos cuando el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      startTransition(() => {
        setFavoriteIds(new Set());
        setIsLoading(false);
      });
      return;
    }
    
    let cancelled = false;
    startTransition(() => setIsLoading(true));
    
    favoriteService
      .getAll()
      .then((favorites) => {
        if (!cancelled) {
          startTransition(() => {
            const ids = new Set(favorites.map((f) => f.gameId));
            setFavoriteIds(ids);
          });
        }
      })
      .catch((err) => {
        console.error("Error al cargar favoritos:", err);
      })
      .finally(() => {
        if (!cancelled) {
          startTransition(() => setIsLoading(false));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const isFavorite = useCallback(
    (gameId: number) => favoriteIds.has(gameId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (gameId: number) => {
      if (favoriteIds.has(gameId)) {
        // Quitar de favoritos
        await favoriteService.remove(gameId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(gameId);
          return next;
        });
      } else {
        // Añadir a favoritos
        await favoriteService.add(gameId);
        setFavoriteIds((prev) => new Set(prev).add(gameId));
      }
    },
    [favoriteIds]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isLoading,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteIds, isLoading, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider />");
  }
  return context;
}
