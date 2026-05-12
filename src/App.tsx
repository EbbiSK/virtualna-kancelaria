import { Routes, Route, Navigate } from "react-router-dom";

import HomeView from "./components/HomeView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<HomeView />} />

      <Route path="/rooms" element={<HomeView />} />
      <Route path="/rooms/:roomSlug" element={<HomeView />} />
      <Route path="/rooms/:roomSlug/meeting" element={<HomeView />} />

      <Route path="/chat" element={<HomeView />} />
      <Route path="/chat/:roomSlug" element={<HomeView />} />

      <Route path="/messages" element={<HomeView />} />

      <Route path="/calendar" element={<HomeView />} />

      <Route path="/settings" element={<HomeView />} />

      <Route path="/employee/:employeeId" element={<HomeView />} />
      <Route path="/employee/:employeeId/chat" element={<HomeView />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}