// context/AuthContext.ts
import { createContext } from "react";
import type { User } from "../Interface/auth";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading?: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
