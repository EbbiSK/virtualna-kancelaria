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

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <div className="rounded-[30px] border border-green-100 bg-white px-8 py-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="text-[72px] leading-none">🏢</div>
            </div>

            <h2 className="mb-5 text-center text-3xl font-black text-green-700">
              Miestnosti
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openRooms}
                className="rounded-2xl bg-orange-500 px-8 py-3 text-xl font-bold text-white shadow-md transition hover:bg-orange-600"
              >
                Vstúpiť
              </button>
            </div>
          </div>

          <div className="rounded-[30px] border border-green-100 bg-white px-8 py-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <Settings
                size={72}
                className="text-green-700"
                strokeWidth={2.5}
              />
            </div>

            <h2 className="mb-5 text-center text-3xl font-black text-green-700">
              Nastavenia
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openSettings}
                className="rounded-2xl bg-orange-500 px-8 py-3 text-xl font-bold text-white shadow-md transition hover:bg-orange-600"
              >
                Otvoriť
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-lg text-green-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 font-black text-white shadow-md">
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