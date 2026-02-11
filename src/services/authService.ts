import axios from "axios";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types/User";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string ?? "http://localhost:3000";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/autenticacion/iniciar-sesion`,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await axios.post<User>(
      `${API_BASE_URL}/autenticacion/registro`,
      data
    );
    return response.data;
  },

  async me(token: string): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/autenticacion/yo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateUser(userId: number, data: Partial<Pick<User, 'name' | 'imagenUrl'>>, token: string): Promise<User> {
    const response = await axios.patch<User>(
      `${API_BASE_URL}/usuarios/${userId}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
