import { createContext, useContext, useMemo, useState } from "react";
import type { AuthSession, User } from "../types/User";
import { authStorage } from "./authStorage";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial: AuthSession | null = authStorage.get();

  const [user, setUser] = useState<User | null>(initial?.user ?? null);
  const [token, setToken] = useState<string | null>(initial?.token ?? null);

  function login(session: AuthSession) {
    authStorage.set(session);
    setUser(session.user);
    setToken(session.token);
  }

  function logout() {
    authStorage.clear();
    setUser(null);
    setToken(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  }
  return context;
}
