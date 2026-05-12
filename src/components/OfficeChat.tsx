import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hash, Send, Trash2 } from "lucide-react";

import { useOffice, type Room } from "../context/OfficeContext";
import { useUserSettings } from "../context/UserSettingsContext";

type Message = {
  id: number;
  userId: number | null;
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

function getDefaultMessages(room?: Room): Message[] {
  return [
    {
      id: 1,
      userId: null,
      user: "System",
      message: room
        ? `Vitaj v kanáli #${room.name}.`
        : "Vitaj vo firemnom chate.",
      time: "09:00",
    },
  ];
}

export default function OfficeChat() {
  const navigate = useNavigate();
  const { roomSlug } = useParams();

  const { rooms, employees } = useOffice();
  const { activeUserId } = useUserSettings();

  const activeUser = employees.find((employee) => employee.id === activeUserId);

  const selectedRoom =
    rooms.find((room) => createSlug(room.name) === roomSlug) || null;

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const storageKey = selectedRoom
    ? `channelMessages-${selectedRoom.id}`
    : "companyChatMessages";

  useEffect(() => {
    const savedMessages = localStorage.getItem(storageKey);

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(getDefaultMessages(selectedRoom || undefined));
    }

    setInputValue("");
  }, [storageKey, selectedRoom?.id]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  function sendMessage() {
    if (!inputValue.trim() || !activeUser) return;

    const now = new Date();

    const newMessage: Message = {
      id: Date.now(),
      userId: activeUser.id,
      user: activeUser.name,
      message: inputValue,
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  }

  function clearChat() {
    localStorage.removeItem(storageKey);
    setMessages(getDefaultMessages(selectedRoom || undefined));
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
      <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">
          Kanály
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Chat miestností
        </p>

        <div className="mt-5 space-y-2">
          <button
            onClick={() => navigate("/chat")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
              !selectedRoom
                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <Hash size={16} />
            firemny-chat
          </button>

          {rooms.map((room) => {
            const isActive = selectedRoom?.id === room.id;

            return (
              <button
                key={room.id}
                onClick={() => navigate(`/chat/${createSlug(room.name)}`)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                  isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Hash size={16} />
                {room.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">
              {selectedRoom ? `# ${selectedRoom.name}` : "# firemny-chat"}
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Píšeš ako:{" "}
              <span className="font-bold text-green-700 dark:text-green-400">
                {activeUser?.name || "Neznámy používateľ"}
              </span>
            </p>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Trash2 size={15} />
            Vymazať
          </button>
        </div>

        <div className="max-h-[520px] min-h-[360px] space-y-1 overflow-y-auto p-4">
          {messages.map((msg) => {
            const isOwn = msg.userId === activeUserId;

            return (
              <div
                key={msg.id}
                className="rounded-xl px-3 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                      isOwn
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {msg.user.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {msg.user}
                      </span>

                      {isOwn && (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          ty
                        </span>
                      )}

                      <span className="text-xs text-zinc-400">{msg.time}</span>
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder={
                selectedRoom
                  ? `Napíš správu do #${selectedRoom.name}...`
                  : "Napíš správu do firemného chatu..."
              }
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

            <button
              onClick={sendMessage}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
            >
              <Send size={16} />
              Odoslať
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}