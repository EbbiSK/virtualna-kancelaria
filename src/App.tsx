import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RoomsPage from "./pages/RoomsPage";
import MeetingRoom from "./pages/MeetingRoom";
import OfficeChat from "./pages/OfficeChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" replace />} />

        <Route path="/rooms" element={<RoomsPage />} />

        <Route path="/meeting/:roomSlug" element={<MeetingRoom />} />

        <Route path="/chat" element={<OfficeChat />} />

        <Route path="/chat/:roomSlug" element={<OfficeChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;