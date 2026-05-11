import { useEffect, useState } from "react";

type Message = {
  id: number;
  user: string;
  message: string;
  time: string;
  own: boolean;
};

const defaultMessages: Message[] = [
  {
    id: 1,
    user: "Jaro",
    message: "Dobré ráno tím 👋",
    time: "09:12",
    own: false,
  },
  {
    id: 2,
    user: "Michaela",
    message: "Marketing meeting o 10:00.",
    time: "09:14",
    own: false,
  },
  {
    id: 3,
    user: "Ty",
    message: "Pripravujem nový dizajn kancelárie.",
    time: "09:16",
    own: true,
  },
];

export default function OfficeChat() {
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("officeChatMessages");

    if (savedMessages) {
      return JSON.parse(savedMessages);
    }

    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem(
      "officeChatMessages",
      JSON.stringify(messages)
    );
  }, [messages]);

  function sendMessage() {
    if (!inputValue.trim()) return;

    const now = new Date();

    const newMessage: Message = {
      id: Date.now(),
      user: "Ty",
      message: inputValue,
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      own: true,
    };

    setMessages([...messages, newMessage]);

    setInputValue("");
  }

  function clearChat() {
    localStorage.removeItem("officeChatMessages");

    setMessages(defaultMessages);
  }

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Firemný Chat
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Realtime komunikácia tímu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearChat}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Vymazať
          </button>

          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Online
          </div>
        </div>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.own ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md rounded-3xl px-5 py-4 shadow-sm ${
                msg.own
                  ? "bg-gradient-to-r from-green-500 to-orange-400 text-white"
                  : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
              }`}
            >
              <div className="mb-1 text-xs font-bold opacity-70">
                {msg.user}
              </div>

              <div className="text-sm leading-relaxed">
                {msg.message}
              </div>

              <div className="mt-2 text-right text-xs opacity-60">
                {msg.time}
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
                sendMessage();
              }
            }}
            placeholder="Napíš správu..."
            className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

          <button
            onClick={sendMessage}
            className="rounded-2xl bg-gradient-to-r from-green-500 to-orange-400 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
          >
            Odoslať
          </button>
        </div>
      </div>
    </div>
  );
}