import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";

import { useOffice } from "../context/OfficeContext";
import { useUserSettings } from "../context/UserSettingsContext";

type TopBarProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setMobileOpen?: (value: boolean) => void;
};

export default function TopBar({ setMobileOpen }: TopBarProps) {
  const navigate = useNavigate();

  const { employees } = useOffice();
  const { avatar, activeUserId } = useUserSettings();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("ebbi-auth") === "true";

  const activeUser = employees.find(
    (employee) => employee.id === activeUserId
  );

  function handleLogout() {
    localStorage.removeItem("ebbi-auth");
    window.location.reload();
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen?.(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white xl:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Ebbi Office
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Virtuálna kancelária tímu
          </p>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-sm font-bold text-zinc-900 shadow-sm transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green-600 text-sm font-black text-white">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  activeUser?.name.charAt(0) || "J"
                )}
              </div>

              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900" />
            </div>

            <span>{activeUser?.name || "Používateľ"}</span>

            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate(`/employee/${activeUser?.id || activeUserId}`);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <User size={17} />
                Profil
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Settings size={17} />
                Nastavenia
              </button>

              <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={17} />
                Odhlásiť sa
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700">
          Prihlásiť sa
        </button>
      )}
    </div>
  );
}