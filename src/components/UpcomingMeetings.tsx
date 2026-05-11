const meetings = [
  {
    id: 1,
    title: "Marketing Sync",
    time: "10:00",
    room: "Marketing",
    users: 6,
  },
  {
    id: 2,
    title: "Development Standup",
    time: "11:30",
    room: "IT kancelária",
    users: 12,
  },
  {
    id: 3,
    title: "Management Review",
    time: "14:00",
    room: "Manažment",
    users: 4,
  },
];

export default function UpcomingMeetings() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white md:text-xl">
            Upcoming Meetings
          </h2>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
            Najbližšie meetingy
          </p>
        </div>

        <button className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 md:px-4">
          + Nový
        </button>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-white md:text-base">
                  {meeting.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
                  {meeting.room}
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-bold text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300 md:px-3 md:text-sm">
                {meeting.time}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
                {meeting.users} účastníkov
              </span>

              <button className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400 md:px-4 md:text-sm">
                Pripojiť
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}