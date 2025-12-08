import { createContext } from "react";

// Définition et création du Context
// Il contient les valeurs par défaut
// ajouter role ici , j'en aurai besoin dans le dashboard pour protéger les routes
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});
