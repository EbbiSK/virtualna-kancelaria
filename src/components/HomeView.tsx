import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import OfficeStats from "./OfficeStats";
import QuickActions from "./QuickActions";
import RoomsGrid from "./RoomsGrid";
import UpcomingMeetings from "./UpcomingMeetings";
import OfficeChat from "./OfficeChat";
import SettingsPanel from "./SettingsPanel";

export default function HomeView() {
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Sidebar
          avatar={avatar}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
            <TopBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setMobileOpen={setMobileOpen}
            />

            {location.pathname === "/dashboard" && (
              <>
                <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-4xl">
                      Ahoj, Jaroslav!
                    </h1>

                    <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 md:text-lg">
                      Vitaj vo svojej virtuálnej kancelárii
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      Dnes
                    </p>

                    <p className="mt-1 text-lg font-black text-zinc-900 dark:text-white">
                      Aktívny pracovný deň
                    </p>
                  </div>
                </section>

                <OfficeStats />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <QuickActions />
                  <UpcomingMeetings />
                </div>
              </>
            )}

            {location.pathname === "/rooms" && <RoomsGrid />}

            {location.pathname === "/chat" && <OfficeChat />}

            {location.pathname === "/calendar" && <UpcomingMeetings />}

            {location.pathname === "/settings" && (
              <SettingsPanel
                avatar={avatar}
                onAvatarUpload={handleAvatarUpload}
                onRemoveAvatar={removeAvatar}
              />
            )}

            <div className="pt-8 text-center text-sm font-semibold text-zinc-400">
              Developed by Ebbi
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}