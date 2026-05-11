export default function OfficeStats() {
  const stats = [
    {
      label: "Online",
      value: "24",
      description: "zamestnancov",
    },
    {
      label: "Meetingy",
      value: "8",
      description: "dnes naplánované",
    },
    {
      label: "Miestnosti",
      value: "12",
      description: "aktívnych miestností",
    },
    {
      label: "Aktivita",
      value: "92%",
      description: "využitie kancelárie",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition hover:border-green-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-800 md:p-5"
        >
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 md:text-sm">
            {stat.label}
          </p>

          <h3 className="mt-2 text-2xl font-black text-zinc-900 dark:text-white md:text-3xl">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}