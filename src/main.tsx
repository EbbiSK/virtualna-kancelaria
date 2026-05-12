import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { OfficeProvider } from "./context/OfficeContext";
import { UserSettingsProvider } from "./context/UserSettingsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserSettingsProvider>
        <OfficeProvider>
          <App />
        </OfficeProvider>
      </UserSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);