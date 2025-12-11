import DashLayout from "../../components/Dashboard/DashLayout";
import { useParams } from "react-router-dom";
import "../../mocks/data.json";

export default function Dashboard() {
  // On récupère le role depuis l'URL params : /dashboard/:role
  const { role } = useParams();

  // Vérifie si le rôle est valide (provider ou client)
  const validRole =
    role === "provider" || role === "customer" ? role : "customer";

  return <DashLayout userRole={validRole} />;
}
