import type { Employee, Room } from "../context/OfficeContext";

type Props = {
  rooms: Room[];
  employees: Employee[];
  onOpenRooms: () => void;
};

export default function Dashboard({ rooms, employees, onOpenRooms }: Props) {
  return (
    <section className="space-y-8 rounded-[32px] border border-white/10 bg-white/80 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-950/80 dark:shadow-black/20">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-400">
          Virtuálne prostredie
        </p>
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
          Virtuálna kancelária EBBI
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Vítame vás v centrále vašej tímovej spolupráce. Sledujte miestnosti,
          tímovú aktivitu a prístup k asistentovi priamo z tohto dashboardu.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-emerald-100/70 bg-white/90 p-6 shadow-lg shadow-emerald-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-emerald-300/30 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
            Miestnosti
          </p>
          <p className="mt-4 text-5xl font-extrabold text-slate-950 dark:text-white">
            {rooms.length}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Aktuálny počet pracovných priestorov vo vašej kancelárii.
          </p>
        </div>

        <div className="rounded-[28px] border border-orange-100/70 bg-white/90 p-6 shadow-lg shadow-orange-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-orange-300/30 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
            Zamestnanci
          </p>
          <p className="mt-4 text-5xl font-extrabold text-slate-950 dark:text-white">
            {employees.length}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Počet členov tímu, ktorí sú registrovaní v systéme.
          </p>
        </div>

        <div className="rounded-[28px] border border-emerald-100/70 bg-white/90 p-6 shadow-lg shadow-emerald-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-emerald-300/30 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
            Meetingy
          </p>
          <p className="mt-4 text-5xl font-extrabold text-slate-950 dark:text-white">
            {rooms.length}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Približný počet aktívnych tímových meetingov v prostredí.
          </p>
        </div>

        <div className="rounded-[28px] border border-orange-100/70 bg-white/90 p-6 shadow-lg shadow-orange-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-orange-300/30 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
            AI Asistent
          </p>
          <p className="mt-4 text-5xl font-extrabold text-slate-950 dark:text-white">
            Pripravený
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Inteligentný asistent je pripravený pomôcť s plánovaním a úlohami.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-950/5 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Akcia
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              Začnite prieskum miestností
            </h2>
          </div>

          <button
            onClick={onOpenRooms}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Otvoriť miestnosti
          </button>
        </div>
      </div>
    </section>
  );
}
