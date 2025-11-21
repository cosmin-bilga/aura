import { createContext } from 'react';

// Définition et création du Context
// Il contient les valeurs par défaut
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},  
  logout: () => {}, 
});