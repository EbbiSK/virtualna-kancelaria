import { FileUp, Phone, PhoneCall, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { MiniAvatarRow } from "./virtual-office/MiniAvatarRow";
import type { Person, Room, RoomCallState } from "../types/virtualOffice";

type ActivityCardsProps = {
  activeCalls: Array<{
    room: Room;
    call: RoomCallState;
    starter: Person | null;
  }>;
  allPeople: Person[];
  onOpenRoom: (room: Room) => void;
};

export function ActivityCards({
  activeCalls,
  allPeople,
  onOpenRoom,
}: ActivityCardsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-[28px] border border-white/8 bg-[#111c31] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-white">Aktivita</h2>
          <span className="text-sm text-slate-500">09:20</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl p-3 hover:bg-white/[0.03]">
            <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-300">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <p className="text-lg text-white">Atlas – Hovor začal</p>
              <p className="text-sm text-slate-400">
                Milan Horváth spustil spoločný hovor
              </p>
            </div>
            <span className="text-sm text-slate-500">09:20</span>
          </div>

          <div className="flex items-start gap-4 rounded-2xl p-3 hover:bg-white/[0.03]">
            <div className="rounded-2xl bg-slate-500/15 p-3 text-slate-300">
              <FileUp size={18} />
            </div>
            <div className="flex-1">
              <p className="text-lg text-white">Milan Horváth pridal súbor</p>
              <p className="text-sm text-slate-400">Shared-komponenty.zip</p>
            </div>
            <span className="text-sm text-slate-500">09:15</span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/8 bg-[#111c31] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-white">Aktívne hovory</h2>
          <PhoneCall className="text-slate-500" size={20} />
        </div>

        {activeCalls.length > 0 ? (
          <div className="space-y-4">
            {activeCalls.map(({ room, call }) => (
              <div
                key={room.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-white">
                        {room.name}
                      </p>
                      <p className="text-base text-slate-400">
                        {room.project}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenRoom(room)}
                    className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/30"
                  >
                    Pripojiť sa
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <MiniAvatarRow
                    people={allPeople.filter((person) =>
                      call.participantIds.includes(person.id)
                    )}
                  />
                  <span className="text-sm text-slate-500">
                    {call.participantIds.length} účastníci
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-4 text-left text-lg text-slate-300 transition hover:bg-white/[0.03]"
            >
              <span>Zobraziť všetky hovory</span>
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <EmptyState
            title="Žiadne hovory"
            description="Momentálne nebeží žiadny spoločný hovor."
          />
        )}
      </div>
    </div>
  );
}