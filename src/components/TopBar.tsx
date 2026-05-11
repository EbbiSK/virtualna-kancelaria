import { Bell, Menu, Moon, Sun } from "lucide-react";

type TopBarProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setMobileOpen?: (value: boolean) => void;
};

export default function TopBar({
  darkMode,
  setDarkMode,
  setMobileOpen,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen?.(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white xl:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white md:text-2xl">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Virtuálna kancelária
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white md:h-11 md:w-11"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm transition hover:bg-green-700 md:h-11 md:w-11">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}