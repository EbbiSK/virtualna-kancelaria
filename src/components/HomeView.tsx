import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import LoginScreen from "./LoginScreen";

import { useUserSettings } from "../context/UserSettingsContext";

export default function HomeView() {
  const { darkMode, setDarkMode } = useUserSettings();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("ebbi-auth");
    setIsLoggedIn(savedLogin === "true");
  }, []);

  function handleLogin(email: string, password: string) {
    if (!email.trim() || !password.trim()) return;

    const userName = email.split("@")[0];

    localStorage.setItem("ebbi-auth", "true");
    localStorage.setItem("ebbi-user-email", email.trim());
    localStorage.setItem("ebbi-user-name", userName);

    setIsLoggedIn(true);
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <TopBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setMobileOpen={setMobileOpen}
            />

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
