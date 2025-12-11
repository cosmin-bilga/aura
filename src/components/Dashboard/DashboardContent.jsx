// src/components/DashboardContent/DashboardContent.jsx
import DashboardPage from "../DashboardPage/DashboardPage";

export default function DashboardContent({ role, page }) {
  // Si aucune page n'est fournie, on redirige vers "home" par défaut
  const currentPage = page || "home";

  // On vérifie si le rôle est valide
  const roles = ["client", "provider", "admin"];
  if (!roles.includes(role)) return <p>Rôle invalide</p>;

  return <DashboardPage role={role} page={currentPage} />;
}
