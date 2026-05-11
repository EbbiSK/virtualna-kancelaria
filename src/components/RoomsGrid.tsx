import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DoorOpen,
  Users,
  Video,
  MessageSquare,
  ArrowLeft,
  Send,
  X,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Maximize2,
  Minimize2,
} from "lucide-react";

const rooms = [
  {
    id: 1,
    slug: "manazment",
    name: "Manažment",
    users: 4,
    status: "Aktívna",
    description: "Strategické rozhodnutia, vedenie firmy a plánovanie.",
  },
  {
    id: 2,
    slug: "marketing",
    name: "Marketing",
    users: 7,
    status: "Aktívna",
    description: "Kampane, sociálne siete, obsah a komunikácia značky.",
  },
  {
    id: 3,
    slug: "it-kancelaria",
    name: "IT kancelária",
    users: 12,
    status: "Najviac aktívna",
    description: "Vývoj, technická podpora, bugy a produktové úlohy.",
  },
  {
    id: 4,
    slug: "support",
    name: "Support",
    users: 5,
    status: "Aktívna",
    description: "Zákaznícka podpora, požiadavky a riešenie ticketov.",
  },
];

type Room = (typeof rooms)[0];

type RoomMessage = {
  id: number;
  user: string;
  message: string;
  time: string;
};

function getDefaultMessages(room: Room): RoomMessage[] {
  return [
    {
      id: 1,
      user: "System",
      message: `Vitaj v miestnosti ${room.name}.`,
      time: "09:00",
    },
  ];
}

export default function RoomsGrid() {
  const navigate = useNavigate();
  const { roomSlug } = useParams();

  const selectedRoom = rooms.find((room) => room.slug === roomSlug) || null;

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [fullscreenMeeting, setFullscreenMeeting] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    if (!selectedRoom) return;

    const savedMessages = localStorage.getItem(
      `roomMessages-${selectedRoom.id}`
    );

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(getDefaultMessages(selectedRoom));
    }

    setInputValue("");
    setMeetingOpen(false);
    setFullscreenMeeting(false);
  }, [selectedRoom?.id]);

  useEffect(() => {
    if (!selectedRoom) return;

    localStorage.setItem(
      `roomMessages-${selectedRoom.id}`,
      JSON.stringify(messages)
    );
  }, [messages, selectedRoom]);

  function sendRoomMessage() {
    if (!inputValue.trim() || !selectedRoom) return;

    const now = new Date();

    const newMessage: RoomMessage = {
      id: Date.now(),
      user: "Ty",
      message: inputValue,
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  }

  function clearRoomChat() {
    if (!selectedRoom) return;

    localStorage.removeItem(`roomMessages-${selectedRoom.id}`);
    setMessages(getDefaultMessages(selectedRoom));
  }

  if (selectedRoom) {
    return (
      <>
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
            <button
              onClick={() => navigate("/rooms")}
              className="mb-6 flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <ArrowLeft size={16} />
              Späť na miestnosti
            </button>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <DoorOpen size={26} />
                </div>

                <h2 className="mt-5 text-3xl font-black text-zinc-900 dark:text-white">
                  {selectedRoom.name}
                </h2>

                <p className="mt-2 max-w-2xl text-zinc-500 dark:text-zinc-400">
                  {selectedRoom.description}
                </p>

                <p className="mt-3 text-sm font-semibold text-green-700 dark:text-green-400">
                  URL: /rooms/{selectedRoom.slug}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Stav miestnosti
                </p>

                <p className="mt-1 text-lg font-black text-green-700 dark:text-green-400">
                  {selectedRoom.status}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <Users className="text-green-700 dark:text-green-400" size={22} />

                <p className="mt-4 text-2xl font-black text-zinc-900 dark:text-white">
                  {selectedRoom.users}
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  používateľov online
                </p>
              </div>

              <button
                onClick={() => setMeetingOpen(true)}
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
              >
                <Video className="text-green-700 dark:text-green-400" size={22} />

                <p className="mt-4 font-black text-zinc-900 dark:text-white">
                  Spustiť meeting
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Meeting pre {selectedRoom.name}
                </p>
              </button>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <MessageSquare
                  className="text-green-700 dark:text-green-400"
                  size={22}
                />

                <p className="mt-4 font-black text-zinc-900 dark:text-white">
                  Room Chat
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Samostatný chat miestnosti
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Chat miestnosti
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {selectedRoom.name}
                </p>
              </div>

              <button
                onClick={clearRoomChat}
                className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Vymazať
              </button>
            </div>

            <div className="max-h-80 space-y-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl px-3 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-black text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {msg.user.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {msg.user}
                        </span>

                        <span className="text-xs text-zinc-400">
                          {msg.time}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendRoomMessage();
                    }
                  }}
                  placeholder={`Napíš správu do ${selectedRoom.name}...`}
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />

                <button
                  onClick={sendRoomMessage}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
                >
                  <Send size={16} />
                  Odoslať
                </button>
              </div>
            </div>
          </div>
        </div>

        {meetingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <div
              className={`overflow-hidden border border-zinc-800 bg-zinc-950 text-white shadow-2xl transition-all ${
                fullscreenMeeting
                  ? "h-full w-full rounded-none"
                  : "w-full max-w-5xl rounded-2xl"
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div>
                  <h3 className="text-lg font-black">
                    Meeting: {selectedRoom.name}
                  </h3>

                  <p className="text-sm text-zinc-400">
                    {selectedRoom.users} účastníkov online
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFullscreenMeeting(!fullscreenMeeting)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800"
                  >
                    {fullscreenMeeting ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => setMeetingOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div
                className={`grid gap-4 p-4 ${
                  fullscreenMeeting
                    ? "h-[calc(100vh-150px)] grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-3"
                }`}
              >
                <div className="relative flex min-h-64 items-center justify-center rounded-2xl bg-zinc-900 md:col-span-2">
                  {cameraOn ? (
                    <div className="text-center">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-3xl font-black">
                        J
                      </div>

                      <p className="mt-4 text-sm font-bold">Ty</p>

                      <p className="mt-1 text-xs text-green-400">
                        Kamera zapnutá
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CameraOff className="mx-auto text-zinc-500" size={42} />

                      <p className="mt-4 text-sm font-bold text-zinc-300">
                        Kamera je vypnutá
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 rounded-xl bg-black/40 px-3 py-2 text-sm font-bold backdrop-blur">
                    Jaroslav
                  </div>

                  {!micOn && (
                    <div className="absolute right-4 top-4 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold">
                      Mic off
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="flex min-h-36 items-center justify-center rounded-2xl bg-zinc-900">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 text-lg font-black">
                        M
                      </div>

                      <p className="mt-3 text-xs font-bold">Michaela</p>
                    </div>
                  </div>

                  <div className="flex min-h-36 items-center justify-center rounded-2xl bg-zinc-900">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 text-lg font-black">
                        P
                      </div>

                      <p className="mt-3 text-xs font-bold">Peter</p>
                    </div>
                  </div>

                  <div className="flex min-h-36 items-center justify-center rounded-2xl bg-zinc-900">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 text-lg font-black">
                        +{Math.max(selectedRoom.users - 3, 1)}
                      </div>

                      <p className="mt-3 text-xs font-bold">Ďalší</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
                <div className="text-sm font-semibold text-zinc-400">
                  Simulovaný meeting interface
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                      micOn
                        ? "bg-zinc-800 text-white hover:bg-zinc-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {micOn ? <Mic size={19} /> : <MicOff size={19} />}
                  </button>

                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                      cameraOn
                        ? "bg-zinc-800 text-white hover:bg-zinc-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {cameraOn ? <Camera size={19} /> : <CameraOff size={19} />}
                  </button>

                  <button
                    onClick={() => setMeetingOpen(false)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                  >
                    <PhoneOff size={19} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white md:text-xl">
            Miestnosti
          </h2>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
            Klikni na miestnosť a otvor ju
          </p>
        </div>

        <span className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => navigate(`/rooms/${room.slug}`)}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm dark:bg-zinc-900 dark:text-green-400">
                <DoorOpen size={18} />
              </div>

              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {room.users} online
              </span>
            </div>

            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white md:text-base">
              {room.name}
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
              {room.status}
            </p>

            <div className="mt-4 rounded-xl bg-white px-4 py-2 text-center text-xs font-bold text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300 md:text-sm">
              Vstúpiť
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}