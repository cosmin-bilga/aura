import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Le Fournisseur (Provider) qui gère l'état
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

  const login = (userData) => {
    // Stocker dans l'état
    setToken(userData.token);
    setUser(userData.user);
    setIsLoggedIn(true);

    // Stocker dans localStorage
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('userRole', userData.user.role);

    // Stocker l'ID selon le rôle
    if (userData.user.role === 'provider') {
      localStorage.setItem('userId', userData.user.id_provider);
    } else if (userData.user.role === 'customer') {
      localStorage.setItem('userId', userData.user.id_customer);
    }
  };

  const logout = () => {
    // Nettoyer l'état
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);

    // Nettoyer localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
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
