// src/pages/Dashboard/Dashboard.jsx
import { useParams } from "react-router-dom";
// import Sidebar from "../../components/Sidebar/Sidebar";
// import BottomBar from "../../components/ButtomBar/ButtomBar";
import DashboardContent from "../../components/DashboardContent/DashboardContent";

export default function Dashboard() {
  const { role, page } = useParams();

  return (
    <div className="dashboard">
      {/* <Sidebar role={role} /> */}
      <DashboardContent role={role} page={page} />
      {/* <BottomBar role={role} /> */}
    </div>
  );
}
