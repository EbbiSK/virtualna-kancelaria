import { Routes, Route, Navigate } from "react-router-dom";

import HomeView from "./components/HomeView";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import SettingsPage from "./pages/SettingsPage";
import EmployeeProfile from "./components/EmployeeProfile";
import DirectMessage from "./components/DirectMessage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />}>
        <Route index element={<DashboardPage />} />
        <Route path="rooms/*" element={<RoomsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="employee/:employeeId/chat" element={<DirectMessage />} />
        <Route path="employee/:employeeId" element={<EmployeeProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;