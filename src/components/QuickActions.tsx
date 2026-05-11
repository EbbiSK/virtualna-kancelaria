import {
  Video,
  Users,
  FolderOpen,
  Settings,
} from "lucide-react";

const actions = [
  {
    id: 1,
    title: "Meeting",
    icon: Video,
  },
  {
    id: 2,
    title: "Pozvať",
    icon: Users,
  },
  {
    id: 3,
    title: "Súbor",
    icon: FolderOpen,
  },
  {
    id: 4,
    title: "Settings",
    icon: Settings,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-4 md:mb-5">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white md:text-xl">
          Quick Actions
        </h2>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
          Rýchle akcie kancelárie
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-4 text-center transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800 md:flex-row md:justify-start md:px-4 md:text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
                <Icon size={18} />
              </div>

              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 md:text-sm">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}