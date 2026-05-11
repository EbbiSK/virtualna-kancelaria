import { Settings } from "lucide-react";

type HomeViewProps = {
  openRooms: () => void;
  openSettings: () => void;
};

export default function HomeView({
  openRooms,
  openSettings,
}: HomeViewProps) {
  return (
    <main className="min-h-[calc(100vh-90px)] bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-14 text-center text-6xl font-black tracking-tight text-green-700">
          Virtuálna kancelária
        </h1>

        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div className="rounded-[34px] border border-green-100 bg-white px-10 py-12 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex justify-center">
              <div className="text-[96px]">🏢</div>
            </div>

            <h2 className="mb-7 text-center text-4xl font-black text-green-700">
              Miestnosti
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openRooms}
                className="rounded-2xl bg-orange-500 px-10 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-orange-600"
              >
                Vstúpiť
              </button>
            </div>
          </div>

          <div className="rounded-[34px] border border-green-100 bg-white px-10 py-12 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex justify-center">
              <Settings
                size={96}
                className="text-green-700"
                strokeWidth={2.5}
              />
            </div>

            <h2 className="mb-7 text-center text-4xl font-black text-green-700">
              Nastavenia
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openSettings}
                className="rounded-2xl bg-orange-500 px-10 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-orange-600"
              >
                Otvoriť
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-4 text-xl text-green-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 font-black text-white shadow-lg">
            E
          </div>

          <span>
            Developed by <strong>Ebbi</strong>
          </span>
        </div>
      </div>
    </main>
  );
}