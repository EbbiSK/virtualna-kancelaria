import { getRoomTone } from "../lib/virtualOffice";
import { UserAvatar } from "./virtual-office/UserAvatar";
import type { Person, Room } from "../types/virtualOffice";

function RoomMapCard({
  room,
  hasCall,
  selected,
  onOpen,
  onAvatarClick,
  onAvatarHover,
  onAvatarLeave,
  tooltipPersonId,
}: {
  room: Room;
  hasCall: boolean;
  selected: boolean;
  onOpen: () => void;
  onAvatarClick: (person: Person) => void;
  onAvatarHover: (person: Person) => void;
  onAvatarLeave: () => void;
  tooltipPersonId?: string | null;
}) {
  const tone = getRoomTone(room.status);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "absolute rounded-[24px] border p-5 text-left transition-all duration-200",
        tone.card,
        selected
          ? "ring-2 ring-cyan-300/40"
          : "hover:scale-[1.01] hover:bg-white/[0.04]",
      ].join(" ")}
      style={{
        left: `${room.position.x}%`,
        top: `${room.position.y}%`,
        width: `${room.position.w}%`,
        height: `${room.position.h}%`,
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <h3 className="text-[22px] font-semibold text-white">{room.name}</h3>
          <p className="mt-1 text-lg text-slate-300">{room.project}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={["rounded-full px-3 py-1 text-sm", tone.pill].join(
                " "
              )}
            >
              {tone.label}
            </span>

            {hasCall ? (
              <span className="rounded-full border border-rose-400/20 bg-rose-500/15 px-3 py-1 text-sm text-rose-300">
                Hovor
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex gap-2">
            {room.people.slice(0, 3).map((person) => {
              const visible = tooltipPersonId === person.id;

              return (
                <div key={person.id} className="relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAvatarClick(person);
                    }}
                    onMouseEnter={(event) => {
                      event.stopPropagation();
                      onAvatarHover(person);
                    }}
                    onMouseLeave={(event) => {
                      event.stopPropagation();
                      onAvatarLeave();
                    }}
                    className="rounded-full"
                  >
                    <UserAvatar
                      name={person.name}
                      presence={person.presence}
                      compact
                    />
                  </button>

                  {visible ? (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#18243d] px-3 py-2 text-xs font-medium text-white shadow-2xl">
                      {person.name}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {room.people.length > 3 ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                +{room.people.length - 3}
              </span>
            ) : null}
          </div>

          {room.people.length === 0 ? (
            <span className="text-sm text-slate-400">Voľná</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

type RoomMapProps = {
  rooms: Room[];
  roomHasCall: Record<string, boolean>;
  selectedRoomId?: string | null;
  hoveredAvatarPersonId?: string | null;
  onOpenRoom: (room: Room) => void;
  onAvatarClick: (room: Room, person: Person) => void;
  onAvatarHover: (person: Person) => void;
  onAvatarLeave: () => void;
};

export function RoomMap({
  rooms,
  roomHasCall,
  selectedRoomId,
  hoveredAvatarPersonId,
  onOpenRoom,
  onAvatarClick,
  onAvatarHover,
  onAvatarLeave,
}: RoomMapProps) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[#111c31] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="relative h-[520px] overflow-hidden rounded-[26px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top,#122446_0%,#0d1830_45%,#0b1425_100%)]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />

        {rooms.map((room) => (
          <RoomMapCard
            key={room.id}
            room={room}
            hasCall={Boolean(roomHasCall[room.id])}
            selected={selectedRoomId === room.id}
            onOpen={() => onOpenRoom(room)}
            onAvatarClick={(person) => onAvatarClick(room, person)}
            onAvatarHover={onAvatarHover}
            onAvatarLeave={onAvatarLeave}
            tooltipPersonId={hoveredAvatarPersonId}
          />
        ))}

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-8 rounded-full border border-white/10 bg-[#0e1930]/90 px-6 py-3 text-sm text-slate-300 backdrop-blur">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Aktívna
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-400" />
            Tichšia
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            Voľná
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            Hovor
          </span>
        </div>
      </div>
    </div>
  );
}