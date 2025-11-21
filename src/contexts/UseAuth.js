import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook d'utilisation simple (pour éviter d'importer useContext partout)
export const useAuth = () => {
  return useContext(AuthContext);
};
