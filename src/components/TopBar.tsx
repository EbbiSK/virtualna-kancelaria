import { Menu } from "lucide-react";

type TopBarProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setMobileOpen?: (value: boolean) => void;
};

export default function TopBar({
  setMobileOpen,
}: TopBarProps) {
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

      <button className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700">
        Prihlásiť sa
      </button>
    </div>
  );
}