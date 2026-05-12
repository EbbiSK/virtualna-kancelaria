import { useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RoomsGrid from "./RoomsGrid";
import SettingsPanel from "./SettingsPanel";
import EmployeeProfile from "./EmployeeProfile";
import DirectMessage from "./DirectMessage";

import { useUserSettings } from "../context/UserSettingsContext";

export default function HomeView() {
  const location = useLocation();

  const {
    darkMode,
    setDarkMode,
    avatar,
    setAvatarFromFile,
    removeAvatar,
  } = useUserSettings();

  const [mobileOpen, setMobileOpen] = useState(false);

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setAvatarFromFile(file);
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <TopBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setMobileOpen={setMobileOpen}
            />

            {(location.pathname === "/rooms" ||
              location.pathname.startsWith("/rooms/")) && <RoomsGrid />}

            {location.pathname === "/settings" && (
              <SettingsPanel
                avatar={avatar}
                onAvatarUpload={handleAvatarUpload}
                onRemoveAvatar={removeAvatar}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}

            {location.pathname.startsWith("/employee/") &&
              !location.pathname.endsWith("/chat") && (
                <EmployeeProfile />
              )}

            {location.pathname.endsWith("/chat") && <DirectMessage />}
          </div>
        </main>
      </div>
    </div>
  );
}