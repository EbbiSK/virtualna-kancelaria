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
        room.people.some((person) => person.name.toLowerCase().includes(search))
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
              Vyber miestnosť, pozri obsadenosť alebo nájdi projekt.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow">
              <div className="flex items-center gap-3 text-slate-500">
                <Building2 size={20} />
                <span className="text-sm font-medium">Miestnosti</span>
              </div>
              <div className="mt-3 text-3xl font-extrabold">{rooms.length}</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow">
              <div className="flex items-center gap-3 text-slate-500">
                <Users size={20} />
                <span className="text-sm font-medium">Zamestnanci</span>
              </div>
              <div className="mt-3 text-3xl font-extrabold">{peopleCount}</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow">
              <div className="flex items-center gap-3 text-slate-500">
                <Video size={20} />
                <span className="text-sm font-medium">Aktívne hovory</span>
              </div>
              <div className="mt-3 text-3xl font-extrabold">{activeCallsCount}</div>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow">
            <Search size={22} className="text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Hľadať miestnosť, projekt alebo zamestnanca..."
              className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
            />
          </div>

          {filteredRooms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="text-xl font-bold">Nič sa nenašlo</div>
              <p className="mt-2 text-slate-500">
                Skús zadať iný názov miestnosti, projektu alebo zamestnanca.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredRooms.map((room: Room) => {
                const hasCall = activeCalls[room.id];
                const peopleInRoom = room.people.length;

                return (
                  <button
                    key={room.id}
                    onClick={() => setOpenedRoomId(room.id)}
                    className={[
                      "relative flex min-h-[210px] flex-col items-center justify-center rounded-[28px] border p-6 text-center transition hover:-translate-y-1",
                      hasCall
                        ? "scale-[1.02] border-red-400 bg-red-100 shadow-lg"
                        : "border-slate-200 bg-white shadow hover:shadow-lg",
                    ].join(" ")}
                  >
                    {hasCall ? (
                      <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        LIVE
                      </div>
                    ) : null}

                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Building2 size={44} />
                    </div>

                    <div className="text-2xl font-extrabold">{room.name}</div>

                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                        {peopleInRoom} {peopleInRoom === 1 ? "osoba" : "osôb"}
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

                    {room.projectName ? (
                      <div className="mt-3 text-sm text-slate-500">
                        {room.projectName}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setOpenedRoomId(null)}
            className="mb-6 rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-50"
          >
            ← Späť na miestnosti
          </button>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Building2 size={40} />
                  <h1 className="text-4xl font-bold">{openedRoom.name}</h1>
                </div>

                <button
                  onClick={() =>
                    setActiveCalls((prev) => ({
                      ...prev,
                      [openedRoom.id]: !prev[openedRoom.id],
                    }))
                  }
                  className={[
                    "flex items-center gap-2 rounded-xl border px-4 py-3 font-medium",
                    activeCalls[openedRoom.id]
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-slate-300 bg-white text-slate-900",
                  ].join(" ")}
                >
                  <Video size={20} />
                  {activeCalls[openedRoom.id] ? "Ukončiť hovor" : "Spustiť hovor"}
                </button>
              </div>

              {activeCalls[openedRoom.id] ? (
                <div className="mb-6 rounded-2xl bg-slate-950 p-6 text-white">
                  <div className="mb-4 flex items-center gap-3 text-xl font-bold">
                    <Video />
                    Konferenčný hovor prebieha
                  </div>

                  {openedRoom.people.length === 0 ? (
                    <p className="text-slate-300">
                      V hovore zatiaľ nie sú zamestnanci.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {openedRoom.people.map((person: RoomPerson) => (
                        <div key={person.id} className="rounded-xl bg-white/10 px-4 py-3">
                          {person.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mb-6 space-y-2 text-slate-700">
                <p>
                  <strong>Dátum vzniku:</strong> {openedRoom.createdAt || "nezadaný"}
                </p>
                <p>
                  <strong>Termín porád:</strong> {openedRoom.meetingTerm || "nezadaný"}
                </p>
                <p>
                  <strong>Názov projektu:</strong> {openedRoom.projectName || "nezadaný"}
                </p>
              </div>

              <h2 className="mb-4 text-xl font-bold">Zamestnanci</h2>

              {openedRoom.people.length === 0 ? (
                <p className="text-slate-500">V tejto miestnosti zatiaľ nikto nie je.</p>
              ) : (
                <div className="space-y-3">
                  {openedRoom.people.map((person: RoomPerson) => (
                    <div key={person.id} className="rounded-xl border border-slate-200 px-4 py-3">
                      {person.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-[660px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold">Chat</h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-slate-500">
                  Tvoje meno v chate
                </label>
                <input
                  value={currentUserName}
                  onChange={(event) => setCurrentUserName(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {openedRoomMessages.length === 0 ? (
                  <p className="text-slate-500">Zatiaľ tu nie sú žiadne správy.</p>
                ) : (
                  openedRoomMessages.map((message: RoomMessage) => (
                    <div key={message.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <strong>{message.author}</strong>
                        <span className="text-slate-400">{message.createdAt}</span>
                      </div>

                      {message.text ? (
                        <p className="mb-3 text-slate-800">{message.text}</p>
                      ) : null}

                      {message.attachment ? (
                        <div className="rounded-xl border border-slate-200 p-3">
                          {message.attachment.type.startsWith("image/") ? (
                            <img
                              src={message.attachment.dataUrl}
                              alt={message.attachment.name}
                              className="mb-2 max-h-56 rounded-lg object-contain"
                            />
                          ) : null}

                          <a
                            href={message.attachment.dataUrl}
                            download={message.attachment.name}
                            className="text-sm font-medium underline"
                          >
                            {message.attachment.name}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder="Napíš správu..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFilePick(file);
                    event.target.value = "";
                  }}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-slate-300 px-4"
                  title="Priložiť súbor alebo obrázok"
                >
                  <Paperclip size={20} />
                </button>

                <button
                  onClick={() => sendMessage()}
                  className="rounded-xl bg-slate-950 px-4 text-white"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}