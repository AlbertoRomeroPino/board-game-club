export type User = {
  id: number;
  email: string;
  name: string;
  password?: string; // No se envía desde el servidor normalmente
  imagenUrl?: string;
};

// Usuario público (sin datos sensibles)
export type PublicUser = Pick<User, "id" | "name" | "email">;

export type AuthSession = {
  token: string;
  user: Omit<User, "password">;
};

export type AuthResponse = AuthSession;

// Para login
export type LoginCredentials = {
  email: string;
  password: string;
};

// Para registro
export type RegisterData = {
  email: string;
  password: string;
  name: string;
};