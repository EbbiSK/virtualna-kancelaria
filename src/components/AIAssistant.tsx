export default function AIAssistant() {
  return (
    <div className="fixed bottom-6 right-6 z-50">

      <div className="mb-4 w-80 rounded-3xl border border-zinc-100 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        <div className="flex items-center gap-3">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-orange-400 text-2xl shadow-lg">
            🤖
          </div>

          <div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
              AI Assistant
            </h3>

            <p className="text-sm text-green-600 dark:text-green-400">
              Online
            </p>
          </div>

        </div>

        <div className="mt-5 rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Ahoj 👋<br />
          Môžem vytvoriť meeting, pozvať členov tímu alebo pomôcť s kanceláriou.
        </div>

        <div className="mt-4 flex gap-2">

          <button className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-orange-400 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02]">
            Otvoriť AI
          </button>

          <button className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            ✕
          </button>

        </div>
      </div>

      <button className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-orange-400 text-3xl text-white shadow-2xl transition hover:scale-110">
        🤖
      </button>

    </div>
  );
}