import { useEffect, useMemo, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import {
  Building2,
  ImagePlus,
  Paperclip,
  Search,
  Send,
  Users,
  Video,
} from "lucide-react";
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
  handleFilePick,
}: RoomsViewProps) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!openedRoom) return;

    const firstPersonInRoom = openedRoom.people[0];

    if (firstPersonInRoom?.name) {
      setCurrentUserName(firstPersonInRoom.name);
    }
  }, [openedRoom, setCurrentUserName]);

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
    <main className="mx-auto max-w-6xl px-8 py-10">
      <button
        onClick={goHome}
        className="mb-8 rounded-2xl border border-green-200 bg-white px-5 py-3 font-bold text-green-700 shadow-sm transition hover:bg-green-50"
      >
        ← Späť
      </button>

      {!openedRoom ? (
        <>
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-black text-green-700">Miestnosti</h1>

            <p className="mt-3 text-lg text-green-600">
              Vyber miestnosť, pozri obsadenosť alebo nájdi projekt.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-green-600">
                <Building2 size={22} />
                <span className="font-bold">Miestnosti</span>
              </div>

              <div className="mt-3 text-4xl font-black text-green-700">
                {rooms.length}
              </div>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-green-600">
                <Users size={22} />
                <span className="font-bold">Zamestnanci</span>
              </div>

              <div className="mt-3 text-4xl font-black text-green-700">
                {peopleCount}
              </div>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-green-600">
                <Video size={22} />
                <span className="font-bold">Aktívne hovory</span>
              </div>

              <div className="mt-3 text-4xl font-black text-green-700">
                {activeCallsCount}
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-3 rounded-3xl border border-green-100 bg-white px-5 py-4 shadow-sm">
            <Search size={22} className="text-green-600" />

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Hľadať miestnosť, projekt alebo zamestnanca..."
              className="w-full bg-transparent text-base outline-none placeholder:text-green-400"
            />
          </div>

          {filteredRooms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-green-200 bg-green-50 p-10 text-center">
              <div className="text-xl font-black text-green-700">
                Nič sa nenašlo
              </div>

              <p className="mt-2 text-green-600">
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
                      "relative rounded-[30px] border bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                      hasCall
                        ? "border-red-300 bg-red-50"
                        : "border-green-100",
                    ].join(" ")}
                  >
                    {hasCall ? (
                      <div className="absolute right-5 top-5 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                        LIVE
                      </div>
                    ) : null}

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-white">
                      <Building2 size={36} />
                    </div>

                    <div className="text-3xl font-black text-green-700">
                      {room.name}
                    </div>

                    {room.projectName ? (
                      <div className="mt-2 text-green-600">
                        {room.projectName}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                        {peopleInRoom} {peopleInRoom === 1 ? "osoba" : "osôb"}
                      </span>

                      {hasCall ? (
                        <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600">
                          prebieha hovor
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
                          dostupná
                        </span>
                      )}
                    </div>
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
            className="mb-6 rounded-2xl border border-green-200 bg-white px-5 py-3 font-bold text-green-700 shadow-sm transition hover:bg-green-50"
          >
            ← Späť na miestnosti
          </button>

          <div className="grid gap-6 lg:grid-cols-[1fr_430px]">
            <section className="rounded-[32px] border border-green-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-white">
                    <Building2 size={38} />
                  </div>

                  <div>
                    <h1 className="text-5xl font-black text-green-700">
                      {openedRoom.name}
                    </h1>

                    <p className="mt-1 text-green-600">
                      {openedRoom.projectName || "Projekt nie je zadaný"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setActiveCalls((prev) => ({
                      ...prev,
                      [openedRoom.id]: !prev[openedRoom.id],
                    }))
                  }
                  className={[
                    "flex items-center gap-2 rounded-2xl px-5 py-3 font-black shadow-sm transition",
                    activeCalls[openedRoom.id]
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-orange-500 text-white hover:bg-orange-600",
                  ].join(" ")}
                >
                  <Video size={20} />
                  {activeCalls[openedRoom.id]
                    ? "Ukončiť hovor"
                    : "Spustiť hovor"}
                </button>
              </div>

              {activeCalls[openedRoom.id] ? (
                <div className="mb-8 rounded-3xl bg-green-700 p-6 text-white shadow-sm">
                  <div className="mb-4 flex items-center gap-3 text-xl font-black">
                    <Video />
                    Konferenčný hovor prebieha
                  </div>

                  {openedRoom.people.length === 0 ? (
                    <p className="text-green-100">
                      V hovore zatiaľ nie sú zamestnanci.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {openedRoom.people.map((person: RoomPerson) => (
                        <div
                          key={person.id}
                          className="rounded-2xl bg-white/15 px-4 py-3 font-bold"
                        >
                          {person.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="text-sm font-bold text-green-600">
                    Dátum vzniku
                  </div>

                  <div className="mt-1 font-black text-green-700">
                    {openedRoom.createdAt || "nezadaný"}
                  </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="text-sm font-bold text-green-600">
                    Termín porád
                  </div>

                  <div className="mt-1 font-black text-green-700">
                    {openedRoom.meetingTerm || "nezadaný"}
                  </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="text-sm font-bold text-green-600">
                    Zamestnanci
                  </div>

                  <div className="mt-1 font-black text-green-700">
                    {openedRoom.people.length}
                  </div>
                </div>
              </div>

              <h2 className="mb-4 text-2xl font-black text-green-700">
                Zamestnanci v miestnosti
              </h2>

              {openedRoom.people.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-green-200 bg-green-50 p-8 text-center text-green-600">
                  V tejto miestnosti zatiaľ nikto nie je.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {openedRoom.people.map((person: RoomPerson) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 font-black text-white">
                        {person.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-black text-green-700">
                          {person.name}
                        </div>

                        <div className="text-sm text-green-600">online</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="flex h-[660px] flex-col rounded-[32px] border border-green-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-3xl font-black text-green-700">Chat</h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-green-600">
                  Tvoje meno v chate
                </label>

                <input
                  value={currentUserName}
                  onChange={(event) => setCurrentUserName(event.target.value)}
                  className="w-full rounded-2xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-green-100 bg-green-50 p-4">
                {openedRoomMessages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-green-600">
                    <ImagePlus size={42} className="mb-3" />
                    <p>Zatiaľ tu nie sú žiadne správy.</p>
                  </div>
                ) : (
                  openedRoomMessages.map((message: RoomMessage) => (
                    <div
                      key={message.id}
                      className="rounded-3xl border border-green-100 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3 text-sm">
                        <strong className="text-green-700">
                          {message.author}
                        </strong>

                        <span className="text-green-500">
                          {message.createdAt}
                        </span>
                      </div>

                      {message.text ? (
                        <p className="mb-3 text-green-800">{message.text}</p>
                      ) : null}

                      {message.attachment ? (
                        <div className="overflow-hidden rounded-2xl border border-green-100 bg-green-50 p-2">
                          {message.attachment.type.startsWith("image/") ? (
                            <img
                              src={message.attachment.dataUrl}
                              alt={message.attachment.name}
                              className="max-h-72 w-full rounded-xl object-cover"
                            />
                          ) : null}

                          <a
                            href={message.attachment.dataUrl}
                            download={message.attachment.name}
                            className="mt-2 block text-sm font-bold text-green-700 underline"
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
                  className="w-full rounded-2xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                />

                <label
                  className="flex cursor-pointer items-center justify-center rounded-2xl border border-green-200 bg-white px-4 text-green-700 transition hover:bg-green-50"
                  title="Priložiť fotku"
                >
                  <Paperclip size={22} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        handleFilePick(file);
                      }

                      event.target.value = "";
                    }}
                  />
                </label>

                <button
                  onClick={() => sendMessage()}
                  className="rounded-2xl bg-orange-500 px-5 text-white shadow-md transition hover:bg-orange-600"
                >
                  <Send size={22} />
                </button>
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}