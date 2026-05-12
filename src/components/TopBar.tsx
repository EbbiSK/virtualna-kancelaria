import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";

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
  const userEmail = localStorage.getItem("ebbi-user-email") || "pouzivatel@ebbi.sk";

  const activeUser = employees.find(
    (employee) => employee.id === activeUserId
  );

  const initials =
    activeUser?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JP";

  function handleLogout() {
    localStorage.removeItem("ebbi-auth");
    localStorage.removeItem("ebbi-user-email");
    localStorage.removeItem("ebbi-user-name");
    window.location.reload();
  }

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => setMobileOpen?.(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-green-500 xl:hidden"
      >
        <Menu size={18} />
      </button>

      <div />

      {isLoggedIn && (
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-5 py-4 text-sm font-bold text-zinc-900 shadow-sm transition hover:border-green-200 hover:bg-green-50"
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-600 text-sm font-black text-white">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>

            <span>{userEmail}</span>

            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-16 z-50 w-56 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate(`/employee/${activeUser?.id || activeUserId}`);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                <User size={17} />
                Profil
              </button>

              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Odhlásiť sa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}