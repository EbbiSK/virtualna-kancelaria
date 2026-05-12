import {
  Building2,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { useUserSettings } from "../context/UserSettingsContext";
import { useOffice } from "../context/OfficeContext";

type SidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
};

const menu = [
  {
    name: "Miestnosti",
    path: "/rooms",
    icon: Building2,
  },
  {
    name: "Nastavenia",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { avatar, activeUserId } = useUserSettings();

  const { employees } = useOffice();

  const activeUser = employees.find(
    (employee) => employee.id === activeUserId
  );

  function handleNavigate(path: string) {
    navigate(path);
    setMobileOpen?.(false);
  }

  function handleLogout() {
    localStorage.removeItem("ebbi-auth");
    window.location.reload();
  }

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 xl:static xl:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-lg font-black text-white">
                E
              </div>

              <div>
                <h1 className="text-lg font-black text-zinc-900 dark:text-white">
                  Ebbi Office
                </h1>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Workspace
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen?.(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 xl:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-3">
          {menu.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
          <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-600 text-sm font-black text-white">
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

                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-800" />
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white">
                  {activeUser?.name || "Používateľ"}
                </div>

                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Online
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 dark:bg-white dark:text-zinc-900 dark:hover:bg-red-500"
            >
              <LogOut size={16} />
              Odhlásiť sa
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}