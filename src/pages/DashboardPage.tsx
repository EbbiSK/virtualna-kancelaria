import { useNavigate } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import { useOffice } from "../context/OfficeContext";

export default function DashboardPage() {
  const { rooms, employees } = useOffice();
  const navigate = useNavigate();

  return (
    <Dashboard
      rooms={rooms}
      employees={employees}
      onOpenRooms={() => navigate("/rooms")}
    />
  );
}
