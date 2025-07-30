// context/AuthProvider.tsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type {  User } from "../Interface/auth";
import { jwtDecode } from "jwt-decode";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  

  // Recuperar token y usuario del localStorage al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        if (decoded && decoded.exp * 1000 >= Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          console.log("⛔ Token expirado.");
          logout();
        }
      } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        logout();
      }
    }
    setLoading(false); // ⬅️ Solo se pone false después de procesar
  }, []);


  const login = (token: string) => {
  try {
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Token inválido en login:", error);
  }
};

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
