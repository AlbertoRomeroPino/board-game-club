import type { RegisterData, AuthResponse } from "../types/User";

const API_URL = "http://localhost:3000"; // Cambia esto a tu URL

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrarse");
    }

    return response.json();
  }
};