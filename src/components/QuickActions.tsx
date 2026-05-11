const actions = [
  {
    id: 1,
    title: "Nový Meeting",
    icon: "📹",
    color: "from-green-500 to-emerald-400",
  },
  {
    id: 2,
    title: "Pozvať člena",
    icon: "👥",
    color: "from-orange-500 to-amber-400",
  },
  {
    id: 3,
    title: "Zdieľať súbor",
    icon: "📁",
    color: "from-lime-500 to-green-400",
  },
  {
    id: 4,
    title: "Nastavenia",
    icon: "⚙️",
    color: "from-yellow-500 to-orange-400",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Quick Actions
        </h2>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Rýchle akcie virtuálnej kancelárie
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
            />

            <div className="relative">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-2xl shadow-lg`}
              >
                {action.icon}
              </div>

              <div className="mt-4 text-sm font-bold text-zinc-900 dark:text-white">
                {action.title}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}