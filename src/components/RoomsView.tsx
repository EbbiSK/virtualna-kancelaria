import type { Dispatch, RefObject, SetStateAction } from "react";
import { Building2, Paperclip, Send, Video } from "lucide-react";
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
  return (
    <main className="mx-auto max-w-6xl p-10">
      <button
        onClick={goHome}
        className="mb-8 rounded-xl border border-slate-300 px-5 py-3 font-medium"
      >
        ← Späť
      </button>

      {!openedRoom ? (
        <>
          <h1 className="mb-10 text-center text-4xl font-extrabold">
            Miestnosti
          </h1>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {rooms.map((room: Room) => (
              <button
                key={room.id}
                onClick={() => setOpenedRoomId(room.id)}
                className="flex h-[180px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Building2 size={44} />
                </div>

                <div className="text-2xl font-extrabold">{room.name}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setOpenedRoomId(null)}
            className="mb-6 rounded-xl border border-slate-300 px-5 py-3 font-medium"
          >
            ← Späť na miestnosti
          </button>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
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
                  {activeCalls[openedRoom.id]
                    ? "Ukončiť hovor"
                    : "Spustiť hovor"}
                </button>
              </div>

              {activeCalls[openedRoom.id] && (
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
                        <div
                          key={person.id}
                          className="rounded-xl bg-white/10 px-4 py-3"
                        >
                          {person.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6 space-y-2 text-slate-700">
                <p>
                  <strong>Dátum vzniku:</strong>{" "}
                  {openedRoom.createdAt || "nezadaný"}
                </p>
                <p>
                  <strong>Termín porád:</strong>{" "}
                  {openedRoom.meetingTerm || "nezadaný"}
                </p>
                <p>
                  <strong>Názov projektu:</strong>{" "}
                  {openedRoom.projectName || "nezadaný"}
                </p>
              </div>

              <h2 className="mb-4 text-xl font-bold">Zamestnanci</h2>

              {openedRoom.people.length === 0 ? (
                <p className="text-slate-500">
                  V tejto miestnosti zatiaľ nikto nie je.
                </p>
              ) : (
                <div className="space-y-3">
                  {openedRoom.people.map((person: RoomPerson) => (
                    <div
                      key={person.id}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    >
                      {person.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-[660px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
              <h2 className="mb-4 text-2xl font-bold">Chat</h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-slate-500">
                  Tvoje meno v chate
                </label>
                <input
                  value={currentUserName}
                  onChange={(e) => setCurrentUserName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {openedRoomMessages.length === 0 ? (
                  <p className="text-slate-500">
                    Zatiaľ tu nie sú žiadne správy.
                  </p>
                ) : (
                  openedRoomMessages.map((message: RoomMessage) => (
                    <div
                      key={message.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <strong>{message.author}</strong>
                        <span className="text-slate-400">
                          {message.createdAt}
                        </span>
                      </div>

                      {message.text && (
                        <p className="mb-3 text-slate-800">{message.text}</p>
                      )}

                      {message.attachment && (
                        <div className="rounded-xl border border-slate-200 p-3">
                          {message.attachment.type.startsWith("image/") && (
                            <img
                              src={message.attachment.dataUrl}
                              alt={message.attachment.name}
                              className="mb-2 max-h-56 rounded-lg object-contain"
                            />
                          )}

                          <a
                            href={message.attachment.dataUrl}
                            download={message.attachment.name}
                            className="text-sm font-medium underline"
                          >
                            {message.attachment.name}
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Napíš správu..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFilePick(file);
                    e.target.value = "";
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