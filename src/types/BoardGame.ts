import type { User } from "./User";

export interface BoardGame {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  category: string[];
  rating: number;
  userId: number; // ID del usuario que subió el juego
  createdAt: string; // Fecha de creación
}

// BoardGame con los datos del usuario que lo subió (para la lista pública)
export interface BoardGameWithUser extends BoardGame {
  user?: Pick<User, "id" | "name" | "email">;
}

// Para crear un nuevo juego (sin id, sin userId, sin createdAt - se asignan en el backend)
export type CreateBoardGame = Omit<BoardGame, "id" | "userId" | "createdAt">;

// Para actualizar un juego
export type UpdateBoardGame = Partial<CreateBoardGame>;