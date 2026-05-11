export default function OfficeStats() {
  const stats = [
    {
      label: "Online",
      value: "24",
      color: "from-green-500 to-emerald-400",
    },
    {
      label: "Meetingy",
      value: "8",
      color: "from-orange-500 to-amber-400",
    },
    {
      label: "Miestnosti",
      value: "12",
      color: "from-lime-500 to-green-400",
    },
    {
      label: "Aktivita",
      value: "92%",
      color: "from-yellow-500 to-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
          />

          <div className="relative">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>

            <h3 className="mt-3 text-4xl font-black text-zinc-900 dark:text-white">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}