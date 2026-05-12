import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  Mail,
  CalendarDays,
} from "lucide-react";

import { useOffice, type Room } from "../context/OfficeContext";

type RoomMessage = {
  id: number;
  user: string;
  message: string;
  time: string;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

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
  const location = useLocation();
  const { roomSlug } = useParams();

  const { rooms, employees } = useOffice();

  const selectedRoom =
    rooms.find((room) => createSlug(room.name) === roomSlug) || null;

  const roomEmployees = selectedRoom
    ? employees.filter((employee) => employee.roomId === selectedRoom.id)
    : [];

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [fullscreenMeeting, setFullscreenMeeting] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const isMeetingRoute = location.pathname === `/rooms/${roomSlug}/meeting`;

  useEffect(() => {
    if (!selectedRoom) return;

    const savedMessages = localStorage.getItem(
      `roomMessages-${selectedRoom.id}`
    );

    try {
      const parsedMessages: RoomMessage[] = savedMessages
        ? JSON.parse(savedMessages)
        : getDefaultMessages(selectedRoom);

      setMessages(parsedMessages);
    } catch {
      setMessages(getDefaultMessages(selectedRoom));
    }

    setInputValue("");
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
      message: inputValue.trim(),
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
    setInputValue("");
  }

  function clearRoomChat() {
    if (!selectedRoom) return;

    localStorage.removeItem(`roomMessages-${selectedRoom.id}`);
    setMessages(getDefaultMessages(selectedRoom));
  }

  if (selectedRoom && isMeetingRoute) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 text-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <div>
              <h3 className="text-lg font-black">
                Meeting: {selectedRoom.name}
              </h3>

              <p className="text-sm text-zinc-400">
                {roomEmployees.length} účastníkov
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
                onClick={() =>
                  navigate(`/rooms/${createSlug(selectedRoom.name)}`)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="grid flex-1 gap-4 p-4 md:grid-cols-3">
            <div className="relative flex min-h-[400px] items-center justify-center rounded-2xl bg-zinc-900 md:col-span-2">
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
                    Kamera vypnutá
                  </p>
                </div>
              )}

              {!micOn && (
                <div className="absolute right-4 top-4 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold">
                  Mic off
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {roomEmployees.slice(0, 4).map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => navigate(`/employee/${employee.id}`)}
                  className="flex min-h-[140px] items-center justify-center rounded-2xl bg-zinc-900 transition hover:bg-zinc-800"
                >
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 text-lg font-black">
                      {employee.name.charAt(0)}
                    </div>

                    <p className="mt-3 text-xs font-bold">{employee.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-zinc-800 px-5 py-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                micOn
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {micOn ? <Mic size={19} /> : <MicOff size={19} />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                cameraOn
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {cameraOn ? <Camera size={19} /> : <CameraOff size={19} />}
            </button>

            <button
              onClick={() => navigate(`/rooms/${createSlug(selectedRoom.name)}`)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 transition hover:bg-red-700"
            >
              <PhoneOff size={19} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <div className="grid gap-6 xl:grid-cols-[280px_1fr_280px]">
        <div className="space-y-3">
          <button
            onClick={() => navigate("/rooms")}
            className="flex w-full items-center gap-2 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            Miestnosti
          </button>

          <div className="rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <DoorOpen size={23} />
            </div>

            <h2 className="mt-4 text-2xl font-black text-zinc-900 dark:text-white">
              {selectedRoom.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Virtuálna miestnosť tímu
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-100 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 text-left text-sm font-black text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <MessageSquare size={18} />
              Chat
            </button>

            <button
              onClick={() =>
                navigate(`/rooms/${createSlug(selectedRoom.name)}/meeting`)
              }
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Video size={18} />
              Meeting
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <Mail size={18} />
              Správy
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <CalendarDays size={18} />
              Kalendár
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                Chat
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

          <div className="max-h-[560px] min-h-[520px] space-y-1 overflow-y-auto bg-zinc-50 p-4 dark:bg-zinc-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl px-3 py-3 transition hover:bg-white dark:hover:bg-zinc-900"
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

                      <span className="text-xs text-zinc-400">{msg.time}</span>
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

        <div className="rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-zinc-900 dark:text-white">
              Členovia
            </h3>

            <span className="rounded-xl bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {roomEmployees.length}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {roomEmployees.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                V tejto miestnosti zatiaľ nie sú členovia.
              </p>
            )}

            {roomEmployees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => navigate(`/employee/${employee.id}`)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-sm font-black text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {employee.name.charAt(0)}
                  </div>

                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                    {employee.name}
                  </p>

                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {employee.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
            Ebbi Office
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Vyber miestnosť
          </h2>

          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            Miestnosti sú hlavné pracovné priestory. Po otvorení miestnosti
            uvidíš chat, meeting, správy, kalendár a členov tímu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => {
          const roomEmployeesCount = employees.filter(
            (employee) => employee.roomId === room.id
          ).length;

          return (
            <button
              key={room.id}
              onClick={() => navigate(`/rooms/${createSlug(room.name)}`)}
              className="rounded-3xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-800 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <DoorOpen size={22} />
                </div>

                <span className="rounded-xl bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  {roomEmployeesCount} ľudí
                </span>
              </div>

              <h3 className="mt-5 text-lg font-black text-zinc-900 dark:text-white">
                {room.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Otvoriť pracovný priestor
              </p>

              <div className="mt-5 rounded-2xl bg-zinc-900 px-4 py-3 text-center text-sm font-black text-white transition group-hover:bg-green-700 dark:bg-white dark:text-zinc-900">
                Vstúpiť
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}