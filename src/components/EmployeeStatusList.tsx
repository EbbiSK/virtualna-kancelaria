const employees = [
  { id: 1, name: "Jaro", role: "CEO", room: "Manažment", status: "online" },
  { id: 2, name: "Michaela", role: "Marketing", room: "Marketing", status: "busy" },
  { id: 3, name: "Peter", role: "Developer", room: "IT kancelária", status: "away" },
  { id: 4, name: "Lucia", role: "Support", room: "Zákaznícka podpora", status: "online" },
];

const statusStyles = {
  online: {
    label: "Online",
    dot: "bg-green-500",
    text: "text-green-700 dark:text-green-400",
  },
  busy: {
    label: "Busy",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-400",
  },
  away: {
    label: "Away",
    dot: "bg-zinc-400",
    text: "text-zinc-500 dark:text-zinc-400",
  },
};

export default function EmployeeStatusList() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">
            Tím
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aktuálny stav zamestnancov
          </p>
        </div>

        <span className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Live
        </span>
      </div>

      <div className="space-y-2">
        {employees.map((employee) => {
          const status = statusStyles[employee.status as keyof typeof statusStyles];

          return (
            <div
              key={employee.id}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-sm font-black text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {employee.name.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {employee.name}
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {employee.role} · {employee.room}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-xs font-bold ${status.text}`}>
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                {status.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}