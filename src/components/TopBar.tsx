type TopBarProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

export default function TopBar({
  darkMode,
  setDarkMode,
}: TopBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
      
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Vitaj vo virtuálnej kancelárii Ebbi
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="relative">
          <input
            type="text"
            placeholder="Vyhľadať..."
            className="w-64 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 pr-12 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-xl transition hover:scale-105 hover:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-orange-400 text-xl text-white shadow-lg transition hover:scale-105">
          🔔
        </button>

      </div>
    </div>
  );
}