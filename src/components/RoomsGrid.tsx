const rooms = [
  {
    id: 1,
    name: "Manažment",
    users: 4,
    color: "from-green-500 to-emerald-400",
  },
  {
    id: 2,
    name: "Marketing",
    users: 7,
    color: "from-orange-500 to-amber-400",
  },
  {
    id: 3,
    name: "IT kancelária",
    users: 12,
    color: "from-lime-500 to-green-400",
  },
  {
    id: 4,
    name: "Support",
    users: 5,
    color: "from-yellow-500 to-orange-400",
  },
];

export default function RoomsGrid() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Miestnosti
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aktívne virtuálne kancelárie tímu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${room.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10`}
            />

            <div className="relative">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${room.color} text-2xl font-black text-white shadow-lg`}
              >
                {room.name.charAt(0)}
              </div>

              <h3 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
                {room.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {room.users} používateľov online
              </p>

              <button
                className={`mt-6 w-full rounded-2xl bg-gradient-to-r ${room.color} px-4 py-3 font-semibold text-white shadow-md transition-transform duration-300 hover:scale-[1.02]`}
              >
                Vstúpiť
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}