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
    text: "text-green-600 dark:text-green-400",
    pulse: "animate-pulse",
  },
  busy: {
    label: "Busy",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    pulse: "",
  },
  away: {
    label: "Away",
    dot: "bg-zinc-400",
    text: "text-zinc-500 dark:text-zinc-400",
    pulse: "",
  },
};

export default function EmployeeStatusList() {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Team Status
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Virtuálna kancelária — realtime aktivita
          </p>
        </div>

        <div className="rounded-full bg-gradient-to-r from-green-500 to-orange-400 px-4 py-1 text-xs font-bold text-white shadow">
          LIVE
        </div>
      </div>

      <div className="space-y-4">
        {employees.map((employee) => {
          const status = statusStyles[employee.status as keyof typeof statusStyles];

          return (
            <div
              key={employee.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-700/40"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-orange-400 text-sm font-black text-white shadow-lg">
                    {employee.name.charAt(0)}
                  </div>

                  <div
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 ${status.dot} ${status.pulse}`}
                  />
                </div>

                <div>
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    {employee.name}
                  </div>

                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {employee.role} · {employee.room}
                  </div>
                </div>
              </div>

              <div className={`text-sm font-semibold ${status.text}`}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}