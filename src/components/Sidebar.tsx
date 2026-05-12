import { Building2, Settings, X } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { useUserSettings } from "../context/UserSettingsContext";

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

  const { avatar } = useUserSettings();

  const savedProfile = localStorage.getItem("employee-profile-1");
  const profile = savedProfile ? JSON.parse(savedProfile) : null;

  const firstName = profile?.firstName || "Jaro";
  const lastName = profile?.lastName || "Pospíšil";
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  function handleNavigate(path: string) {
    navigate(path);
    setMobileOpen?.(false);
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 xl:static xl:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-zinc-100 p-5">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-700">
              <span className="text-4xl font-black">E</span>
            </div>

            <h1 className="text-xl font-black text-green-800">
              EBBI s.r.o.
            </h1>
          </div>

          <button
            onClick={() => setMobileOpen?.(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 xl:hidden"
          >
            <X size={18} />
          </button>
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
                    ? "bg-green-50 text-green-700"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-100 p-3">
          <div className="rounded-2xl bg-zinc-50 p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-green-600 text-sm font-black text-white">
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

              <div className="min-w-0">
                <div className="truncate text-sm font-black text-green-800">
                  {fullName}
                </div>

                <div className="text-xs text-zinc-500">
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}