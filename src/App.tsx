import { Navigate, Route, Routes } from "react-router-dom";

import RoomsView from "./components/RoomsView";
import { RoomPanel } from "./components/RoomPanel";
import OfficeChat from "./components/OfficeChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route path="/rooms" element={<RoomsView />} />

      <Route path="/meeting/:roomSlug" element={<RoomPanel />} />

      <Route path="/chat" element={<OfficeChat />} />

      <Route path="/chat/:roomSlug" element={<OfficeChat />} />
    </Routes>
  );
}

export default App;