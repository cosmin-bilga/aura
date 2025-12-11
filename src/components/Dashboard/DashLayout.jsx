import DashSidebar from "./DashSidebar";
import DashContent from "./DashContent";
import { useAuth } from "../../contexts/useAuth"; 
export default function DashLayout({ userRole }) {
  const { user } = useAuth(); 
  return (
    <div className="dash-layout" style={{ display: "flex", height: "100vh" }}>
      {}
      <DashSidebar user={user} role={userRole} />
      <DashContent user={user} role={userRole} />
    </div>
  );
}
