import { useMemo, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { Building2, Paperclip, Search, Send, Users, Video } from "lucide-react";
import type { MessageAttachment, Room, RoomMessage } from "../types";

type RoomPerson = Room["people"][number];

type RoomsViewProps = {
  rooms: Room[];
  openedRoom: Room | null;
  openedRoomMessages: RoomMessage[];
  setOpenedRoomId: (id: string | null) => void;
  goHome: () => void;
  activeCalls: Record<string, boolean>;
  setActiveCalls: Dispatch<SetStateAction<Record<string, boolean>>>;
  currentUserName: string;
  setCurrentUserName: (value: string) => void;
  messageText: string;
  setMessageText: (value: string) => void;
  sendMessage: (attachment?: MessageAttachment) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFilePick: (file: File) => void;
};

export default function RoomsView({
  rooms,
  openedRoom,
  openedRoomMessages,
  setOpenedRoomId,
  goHome,
  activeCalls,
  setActiveCalls,
  currentUserName,
  setCurrentUserName,
  messageText,
  setMessageText,
  sendMessage,
  fileInputRef,
  handleFilePick,
}: RoomsViewProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredRooms = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return rooms;

    return rooms.filter((room) => {
      return (
        room.name.toLowerCase().includes(search) ||
        room.projectName?.toLowerCase().includes(search) ||
        room.people.some((p) => p.name.toLowerCase().includes(search))
      );
    });
  }, [rooms, searchValue]);

  const peopleCount = useMemo(() => {
    return rooms.reduce((sum, room) => sum + room.people.length, 0);
  }, [rooms]);

  const activeCallsCount = useMemo(() => {
    return rooms.filter((room) => activeCalls[room.id]).length;
  }, [rooms, activeCalls]);

  return (
    <main className="mx-auto max-w-6xl p-10">
      <button
        onClick={goHome}
        className="mb-8 rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-50"
      >
        ← Späť
      </button>

      {!openedRoom ? (
        <>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold">Miestnosti</h1>
            <p className="mt-3 text-slate-500">
              Vyber miestnosť alebo vyhľadaj projekt
            </p>
          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-5 shadow">
              <div className="text-sm text-slate-500">Miestnosti</div>
              <div className="text-3xl font-extrabold">{rooms.length}</div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow">
              <div className="text-sm text-slate-500">Zamestnanci</div>
              <div className="text-3xl font-extrabold">{peopleCount}</div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow">
              <div className="text-sm text-slate-500">Hovory</div>
              <div className="text-3xl font-extrabold">{activeCallsCount}</div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-8 flex items-center gap-3 rounded-3xl border bg-white px-5 py-4 shadow">
            <Search size={22} className="text-slate-400" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Hľadať miestnosť..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* ROOMS */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredRooms.map((room: Room) => {
              const hasCall = activeCalls[room.id];
              const peopleInRoom = room.people.length;

              return (
                <button
                  key={room.id}
                  onClick={() => setOpenedRoomId(room.id)}
                  className={[
                    "relative group flex min-h-[210px] flex-col items-center justify-center rounded-[28px] border p-6 text-center transition",
                    hasCall
                      ? "border-red-400 bg-red-100 shadow-lg scale-[1.02]"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg",
                  ].join(" ")}
                >
                  {hasCall && (
                    <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      LIVE
                    </div>
                  )}

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Building2 size={44} />
                  </div>

                  <div className="text-2xl font-extrabold">{room.name}</div>

                  <div className="mt-3 flex gap-2 flex-wrap justify-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {peopleInRoom} osôb
                    </span>

                    {hasCall ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                        prebieha hovor
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        dostupná
                      </span>
                    )}
                  </div>

                  {room.projectName && (
                    <div className="mt-3 text-sm text-slate-500">
                      {room.projectName}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setOpenedRoomId(null)}
            className="mb-6 rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            ← Späť na miestnosti
          </button>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border bg-white p-8 shadow">
              <h1 className="text-3xl font-bold">{openedRoom.name}</h1>
            </div>

            <div className="flex flex-col rounded-3xl border bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold">Chat</h2>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {openedRoomMessages.map((m) => (
                  <div key={m.id} className="rounded-xl border p-3">
                    <strong>{m.author}</strong>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full border px-3 py-2 rounded-xl"
                />
                <button
                  onClick={() => sendMessage()}
                  className="bg-black text-white px-4 rounded-xl"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}