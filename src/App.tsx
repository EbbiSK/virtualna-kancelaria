import { Routes, Route, Navigate } from "react-router-dom";

import HomeView from "./components/HomeView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route path="/rooms" element={<HomeView />} />
      <Route path="/rooms/:roomSlug" element={<HomeView />} />
      <Route path="/rooms/:roomSlug/meeting" element={<HomeView />} />

      <Route path="/settings" element={<HomeView />} />

      <Route path="/employee/:employeeId" element={<HomeView />} />
      <Route path="/employee/:employeeId/chat" element={<HomeView />} />

      <Route path="*" element={<Navigate to="/rooms" replace />} />
    </Routes>
  );
}