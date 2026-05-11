import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import OfficeHeader from "./OfficeHeader";
import OfficeStats from "./OfficeStats";
import QuickActions from "./QuickActions";
import RoomsGrid from "./RoomsGrid";
import UpcomingMeetings from "./UpcomingMeetings";
import EmployeeStatusList from "./EmployeeStatusList";
import OfficeChat from "./OfficeChat";
import ActivityFeed from "./ActivityFeed";
import AIAssistant from "./AIAssistant";
import SettingsPanel from "./SettingsPanel";

export default function HomeView() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("userAvatar") || "";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      setAvatar(result);

      localStorage.setItem("userAvatar", result);
    };

    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar("");

    localStorage.removeItem("userAvatar");
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-white dark:bg-zinc-950">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          avatar={avatar}
        />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-7xl space-y-8">
            <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />

            {activePage === "Dashboard" && (
              <>
                <OfficeHeader />

                <OfficeStats />

                <QuickActions />

                <RoomsGrid />

                <UpcomingMeetings />

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                  <EmployeeStatusList />

                  <OfficeChat />

                  <ActivityFeed />
                </div>
              </>
            )}

            {activePage === "Miestnosti" && <RoomsGrid />}

            {activePage === "Chat" && <OfficeChat />}

            {activePage === "Kalendár" && <UpcomingMeetings />}

            {activePage === "Nastavenia" && (
              <SettingsPanel
                avatar={avatar}
                onAvatarUpload={handleAvatarUpload}
                onRemoveAvatar={removeAvatar}
              />
            )}

            <div className="mt-12 flex items-center justify-center gap-3 text-lg text-green-700 dark:text-green-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 font-black text-white shadow-md">
                E
              </div>

              <span>
                Developed by <strong>Ebbi</strong>
              </span>
            </div>
          </div>
        </main>

        <AIAssistant />
      </div>
    </div>
  );
}