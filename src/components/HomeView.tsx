import { Building2, Settings } from "lucide-react";

type HomeViewProps = {
  openRooms: () => void;
  openSettings: () => void;
};

export default function HomeView({
  openRooms,
  openSettings,
}: HomeViewProps) {
  return (
    <main className="min-h-[calc(100vh-90px)] bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="text-7xl font-black tracking-tight text-green-700">
            Virtuálna kancelária
          </h1>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-[36px] border border-green-100 bg-white p-12 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-8 flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-[32px] bg-green-50">
                <Building2 size={90} className="text-green-700" />
              </div>
            </div>

            <h2 className="mb-8 text-center text-5xl font-black text-green-700">
              Miestnosti
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openRooms}
                className="rounded-2xl bg-orange-500 px-10 py-5 text-2xl font-bold text-white shadow-lg transition hover:bg-orange-600"
              >
                Vstúpiť
              </button>
            </div>
          </div>

          <div className="rounded-[36px] border border-green-100 bg-white p-12 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-8 flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-[32px] bg-green-50">
                <Settings size={90} className="text-green-700" />
              </div>
            </div>

            <h2 className="mb-8 text-center text-5xl font-black text-green-700">
              Nastavenia
            </h2>

            <div className="flex justify-center">
              <button
                onClick={openSettings}
                className="rounded-2xl bg-orange-500 px-10 py-5 text-2xl font-bold text-white shadow-lg transition hover:bg-orange-600"
              >
                Otvoriť
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-green-50 px-6 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-2xl font-black text-white">
              B
            </div>

            <div className="text-xl text-green-700">
              Developed by <span className="font-black">Ebbi</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}