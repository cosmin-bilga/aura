import DashSidebar from "./DashSidebar";
import DashContent from "./DashContent";
import { useAuth } from "../../contexts/UseAuth";

export default function DashLayout() {
  const { user } = useAuth(); // récupère le user connecté
  if (!user) return null; // ou un loader si nécessaire
  const role = user.role;

  return (
    <div className="dash-layout" style={{ display: "flex", height: "100vh" }}>
      <DashSidebar user={user} role={role} />
      <DashContent user={user} role={role} />
    </div>
  );
}
