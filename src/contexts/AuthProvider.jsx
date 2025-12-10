import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "aura_auth";

export const AuthProvider = ({ children }) => {
  // Initialiser l'état depuis localStorage si disponible
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('authToken') !== null;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('authToken');
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed && parsed.token && parsed.user) {
        setToken(parsed.token);
        setUser(parsed.user);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.warn("Auth rehydrate failed:", err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (userData) => {
    // Stocker dans l'état
    setToken(userData.token);
    setUser(userData.user);
    setIsLoggedIn(true);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: userData.token, user: userData.user })
      );
    } catch (err) {
      console.warn("Auth persist failed:", err);
    }
  };

  const logout = () => {
    // Nettoyer l'état
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Auth clear failed:", err);
    }
  };

  const value = {
    isLoggedIn,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
