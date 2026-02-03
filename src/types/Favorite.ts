// types/Favorite.ts
import type { BoardGame } from "./BoardGame";

export interface Favorite {
  id: number;
  userId: number;
  gameId: number;
  addedAt: string;
}

// Favorito con los datos del juego incluidos (lo que devuelve GET /favorites)
export interface FavoriteWithGame extends Favorite {
  game?: BoardGame;
}