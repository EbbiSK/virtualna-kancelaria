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
    <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Upcoming Meetings
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Najbližšie firemné meetingy
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-green-500 to-orange-400 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:scale-[1.02]">
          + Nový
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {meeting.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {meeting.room}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 px-3 py-2 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {meeting.time}
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                👥 {meeting.users} účastníkov
              </div>

              <button className="rounded-xl bg-gradient-to-r from-green-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02]">
                Pripojiť sa
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}