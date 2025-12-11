import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "aura_auth";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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
