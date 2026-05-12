import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RoomsGrid from "./RoomsGrid";
import UpcomingMeetings from "./UpcomingMeetings";
import OfficeChat from "./OfficeChat";
import SettingsPanel from "./SettingsPanel";

export default function HomeView() {
  const location = useLocation();
  const navigate = useNavigate();

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
          <div className="mx-auto max-w-5xl space-y-6">
            <TopBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setMobileOpen={setMobileOpen}
            />

            {location.pathname === "/dashboard" && (
              <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
                    Virtuálna kancelária
                  </p>

                  <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                    Ahoj, Jaroslav
                  </h1>

                  <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
                    Vyber si, čo chceš dnes robiť.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    onClick={() => navigate("/rooms")}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
                  >
                    <div className="text-3xl font-black text-green-700 dark:text-green-400">
                      12
                    </div>

                    <div className="mt-2 font-bold text-zinc-900 dark:text-white">
                      Miestnosti
                    </div>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Vstúp do virtuálnej miestnosti
                    </p>
                  </button>

                  <button
                    onClick={() => navigate("/chat")}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
                  >
                    <div className="text-3xl font-black text-green-700 dark:text-green-400">
                      Chat
                    </div>

                    <div className="mt-2 font-bold text-zinc-900 dark:text-white">
                      Firemný chat
                    </div>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Napíš správu tímu
                    </p>
                  </button>

                  <button
                    onClick={() => navigate("/calendar")}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
                  >
                    <div className="text-3xl font-black text-green-700 dark:text-green-400">
                      8
                    </div>

                    <div className="mt-2 font-bold text-zinc-900 dark:text-white">
                      Meetingy
                    </div>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Pozri dnešný kalendár
                    </p>
                  </button>
                </div>
              </div>
            )}

            {location.pathname === "/rooms" && <RoomsGrid />}

            {location.pathname.startsWith("/rooms/") && <RoomsGrid />}

            {location.pathname === "/chat" && <OfficeChat />}

            {location.pathname === "/calendar" && <UpcomingMeetings />}

            {location.pathname === "/settings" && (
              <SettingsPanel
                avatar={avatar}
                onAvatarUpload={handleAvatarUpload}
                onRemoveAvatar={removeAvatar}
              />
            )}

            <div className="pt-6 text-center text-xs font-semibold text-zinc-400">
              Developed by Ebbi
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}