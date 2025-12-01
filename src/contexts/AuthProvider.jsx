import { useState } from "react";
import { AuthContext } from "./AuthContext";

// Le Fournisseur (Provider) qui gère l'état
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData) => {
    setToken(userData.token);
    setUser(userData.user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
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
