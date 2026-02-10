import { http } from "./http";
import type { BoardGame } from "../types/BoardGame";

const API_URL = "/juegos";

export const juegosService = {
  /**
   * Obtiene un juego por su ID.
   * @param id ID del juego a obtener
   * @returns El juego correspondiente al ID proporcionado
   */
  get(id: number): Promise<BoardGame> {
    return http
      .get<BoardGame>(`${API_URL}/${id}`)
      .then((response) => response.data);
  },

  /**
   * Obtiene todos los juegos disponibles.
   * @returns Una lista de todos los juegos disponibles
   */
  getAll(): Promise<BoardGame[]> {
    return http.get<BoardGame[]>(API_URL).then((response) => response.data);
  },

  /**
   * Obtiene todos los juegos disponibles del usuario logueado.
   * @returns Todos los juegos añadidos por el usuario logueado
   */
  getAllByUser(): Promise<BoardGame[]> {
    return http
      .get<BoardGame[]>(`${API_URL}/mios`)
      .then((response) => response.data);
  },

  /**
   * Crea un nuevo juego de mesa con los datos proporcionados.
   * @param NewGame El juego de mesa a crear
   * @returns El juego de mesa creado
   */
  create(NewGame: BoardGame): Promise<BoardGame> {
    return http
      .post<BoardGame>(API_URL, NewGame)
      .then((response) => response.data);
  },

  /**
   * Actualiza un juego de mesa existente.
   * @param updateBoardGame El juego de mesa con los datos actualizados
   * @returns El juego de mesa actualizado
   */
  update(updateBoardGame: BoardGame): Promise<BoardGame> {
    return http
      .put<BoardGame>(`${API_URL}/${updateBoardGame.id}`, updateBoardGame)
      .then((response) => response.data);
  }
};
