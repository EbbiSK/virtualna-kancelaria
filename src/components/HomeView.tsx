import { Settings } from "lucide-react";

type HomeViewProps = {
  openRooms: () => void;
  openSettings: () => void;
};

export default function HomeView({ openRooms, openSettings }: HomeViewProps) {
  return (
    <main className="min-h-[calc(100vh-90px)] bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="mb-16 text-6xl font-black tracking-tight text-green-700">
          Virtuálna kancelária
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-[32px] border border-green-100 bg-white px-10 py-10 shadow-sm">
            <div className="mb-6 flex justify-center">
              <div className="text-[92px] leading-none">🏢</div>
            </div>

            <h2 className="mb-8 text-4xl font-black text-green-700">
              Miestnosti
            </h2>

            <button
              onClick={openRooms}
              className="rounded-2xl bg-orange-500 px-9 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-orange-600"
            >
              Vstúpiť
            </button>
          </div>

          <div className="rounded-[32px] border border-green-100 bg-white px-10 py-10 shadow-sm">
            <div className="mb-6 flex justify-center">
              <Settings size={100} className="text-green-700" strokeWidth={2.6} />
            </div>

            <h2 className="mb-8 text-4xl font-black text-green-700">
              Nastavenia
            </h2>

            <button
              onClick={openSettings}
              className="rounded-2xl bg-orange-500 px-9 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-orange-600"
            >
              Otvoriť
            </button>
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-3 text-green-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 font-black text-white">
            B
          </div>
          <span>
            Developed by <strong>Ebbi</strong>
          </span>
        </div>
      </div>
    </main>
  );
}