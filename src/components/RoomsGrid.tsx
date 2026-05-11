const rooms = [
  {
    id: 1,
    name: "Manažment",
    users: 4,
    status: "Aktívna",
  },
  {
    id: 2,
    name: "Marketing",
    users: 7,
    status: "Aktívna",
  },
  {
    id: 3,
    name: "IT kancelária",
    users: 12,
    status: "Najviac aktívna",
  },
  {
    id: 4,
    name: "Support",
    users: 5,
    status: "Aktívna",
  },
];

export default function RoomsGrid() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white md:text-xl">
            Miestnosti
          </h2>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
            Aktívne virtuálne kancelárie
          </p>
        </div>

        <span className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-black text-green-700 shadow-sm dark:bg-zinc-900 dark:text-green-400">
                {room.name.charAt(0)}
              </div>

              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {room.users} online
              </span>
            </div>

            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white md:text-base">
              {room.name}
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
              {room.status}
            </p>

            <button className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-900 hover:text-white dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-900 md:text-sm">
              Vstúpiť
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}