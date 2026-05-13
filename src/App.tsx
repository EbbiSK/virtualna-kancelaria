import { Navigate, Route, Routes } from "react-router-dom";

import OfficeChat from "./components/OfficeChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />

      <Route path="/chat" element={<OfficeChat />} />

      <Route path="/chat/:roomSlug" element={<OfficeChat />} />
    </Routes>
  );
}

export default App;