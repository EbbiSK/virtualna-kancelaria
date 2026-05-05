import { Building2, Settings } from "lucide-react";

type HomeViewProps = {
  openRooms: () => void;
  openSettings: () => void;
};

export default function HomeView({ openRooms, openSettings }: HomeViewProps) {
  return (
    <main className="flex flex-col items-center px-6 pt-[70px] text-center">
      <Building2 size={76} className="mb-6" />

      <h1 className="mb-10 text-[56px] font-extrabold">
        Virtuálna kancelária
      </h1>

      <div className="flex gap-6">
        <button
          onClick={openRooms}
          className="flex h-[230px] w-[390px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.13)]"
        >
          <Building2 size={42} className="mb-6" />
          <h2 className="text-[30px] font-extrabold">Miestnosti</h2>
          <p className="mt-4 text-[20px]">
            Zobraziť mapu a vstúpiť
            <br />
            do miestností
          </p>
        </button>

        <button
          onClick={openSettings}
          className="flex h-[230px] w-[390px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.13)]"
        >
          <Settings size={44} className="mb-6" />
          <h2 className="text-[30px] font-extrabold">Nastavenia</h2>
          <p className="mt-4 text-[20px]">
            Spravujte svoje preferencie
            <br />a nastavenia
          </p>
        </button>
      </div>

      <div className="mt-12 flex items-center gap-8">
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-2xl bg-slate-950 text-[54px] font-extrabold text-white">
          R
        </div>
        <div className="text-[72px] font-extrabold">Rentulo</div>
      </div>
    </main>
  );
}