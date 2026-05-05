import { Phone } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { getPresenceMeta } from "../lib/virtualOffice";
import { UserAvatar } from "./virtual-office/UserAvatar";
import type { Person, Room } from "../types/virtualOffice";

type ActivityPanelProps = {
  activeCalls: Array<{
    room: Room;
    call: {
      roomId: string;
      startedById: string;
      participantIds: string[];
      startedAt: string;
    };
    starter: Person | null;
  }>;
  selectedPerson: Person | null;
  currentUserId: string;
  onOpenRoom: (room: Room) => void;
  onOpenDm: (person: Person) => void;
};

export function ActivityPanel({
  activeCalls,
  selectedPerson,
  currentUserId,
  onOpenRoom,
  onOpenDm,
}: ActivityPanelProps) {
  const profileMeta = selectedPerson
    ? getPresenceMeta(selectedPerson.presence)
    : null;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5">
        <h2 className="text-4xl font-semibold text-white">Aktivita</h2>
        <p className="mt-2 text-lg text-slate-400">
          Vyber miestnosť na mape alebo otvor DM.
        </p>
      </div>

      <div className="space-y-4">
        {activeCalls.map(({ room, call }) => (
          <button
            key={room.id}
            type="button"
            onClick={() => onOpenRoom(room)}
            className="rounded-[24px] border border-white/8 bg-[#16233d] p-4 text-left transition hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xl font-medium text-white">{room.name}</p>
                  <p className="text-sm text-slate-400">{room.project}</p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                {call.participantIds.length} v hovore
              </span>
            </div>
          </button>
        ))}

        <div className="rounded-[24px] border border-white/8 bg-[#16233d] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Profil</h3>
          </div>

          {selectedPerson ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={selectedPerson.name}
                  presence={selectedPerson.presence}
                />
                <div>
                  <p className="text-xl font-semibold text-white">
                    {selectedPerson.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {selectedPerson.role}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">
                  Projekt
                </p>
                <p className="mt-1 text-base text-slate-200">
                  {selectedPerson.project}
                </p>
              </div>

              {profileMeta ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </p>
                  <span
                    className={[
                      "mt-2 inline-flex rounded-full px-3 py-1 text-sm",
                      profileMeta.badge,
                    ].join(" ")}
                  >
                    {profileMeta.label}
                  </span>
                </div>
              ) : null}

              {selectedPerson.id !== currentUserId ? (
                <button
                  type="button"
                  onClick={() => onOpenDm(selectedPerson)}
                  className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-base font-medium text-white transition hover:bg-violet-500"
                >
                  Napísať správu
                </button>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Vyber človeka"
              description="Klikni na avatar priamo v mape alebo v miestnosti."
            />
          )}
        </div>
      </div>
    </div>
  );
}