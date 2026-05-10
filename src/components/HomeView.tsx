import { Building2, Settings } from "lucide-react";

type HomeViewProps = {
  openRooms: () => void;
  openSettings: () => void;
};

export default function HomeView({ openRooms, openSettings }: HomeViewProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl flex-col items-center justify-center px-8 py-16">
      <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-700 text-white shadow-lg">
        <Building2 size={52} />
      </div>

      <h1 className="mb-14 text-center text-6xl font-extrabold tracking-tight">
        Virtuálna kancelária
      </h1>

      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-[32px] border border-green-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-white">
            <Building2 size={38} />
          </div>

          <h2 className="mb-4 text-3xl font-extrabold">Miestnosti</h2>

          <p className="mb-8 text-lg text-slate-600">
            Zobraziť mapu a vstúpiť do miestností
          </p>

          <button
            onClick={openRooms}
            className="rounded-2xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
          >
            Vstúpiť
          </button>
        </div>

        <div className="rounded-[32px] border border-green-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-white">
            <Settings size={38} />
          </div>

          <h2 className="mb-4 text-3xl font-extrabold">Nastavenia</h2>

          <p className="mb-8 text-lg text-slate-600">
            Spravujte svoje preferencie a nastavenia
          </p>

          <button
            onClick={openSettings}
            className="rounded-2xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
          >
            Otvoriť
          </button>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-3 text-slate-500">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 font-bold text-white">
          B
        </div>
        <span>
          Developed by <strong>Ebbi</strong>
        </span>
      </div>
    </main>
  );
}