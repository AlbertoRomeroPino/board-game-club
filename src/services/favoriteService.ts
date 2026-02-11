import type { FavoriteWithGame } from "../types/Favorite";
import { http } from "./http";

const API_URL = "/favoritos";

export const favoriteService = {
  /**
   * Obtiene todos los favoritos del usuario autenticado con los datos del juego.
   */
  getAll(): Promise<FavoriteWithGame[]> {
    return http
      .get<FavoriteWithGame[]>(API_URL)
      .then((response) => response.data);
  },

  /**
   * Añade un juego a favoritos.
   * @param gameId ID del juego a añadir
   */
  add(gameId: number): Promise<FavoriteWithGame> {
    return http
      .post<FavoriteWithGame>(API_URL, { gameId })
      .then((response) => response.data);
  },

  /**
   * Elimina un juego de favoritos.
   * @param gameId ID del juego a eliminar
   */
  remove(gameId: number): Promise<void> {
    return http.delete(`${API_URL}/${gameId}`).then(() => {});
  },
};