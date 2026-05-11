const activities = [
  {
    id: 1,
    user: "Michaela",
    action: "vytvorila nový meeting",
    time: "pred 2 min",
    color: "bg-green-500",
  },
  {
    id: 2,
    user: "Peter",
    action: "uploadol nový dokument",
    time: "pred 5 min",
    color: "bg-orange-500",
  },
  {
    id: 3,
    user: "Lucia",
    action: "sa pripojila do miestnosti Support",
    time: "pred 12 min",
    color: "bg-lime-500",
  },
  {
    id: 4,
    user: "Jaro",
    action: "upravil nastavenia kancelárie",
    time: "pred 18 min",
    color: "bg-yellow-500",
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Activity Feed
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Posledná aktivita vo firme
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          LIVE
        </div>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div
              className={`mt-1 h-3 w-3 rounded-full ${activity.color} animate-pulse`}
            />

            <div className="flex-1">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-white">
                  {activity.user}
                </span>{" "}
                {activity.action}
              </p>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}