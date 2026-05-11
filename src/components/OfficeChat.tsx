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
    localStorage.setItem("officeChatMessages", JSON.stringify(messages));
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
    <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">
            Firemný Chat
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tímová komunikácia
          </p>
        </div>

        <button
          onClick={clearChat}
          className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Vymazať
        </button>
      </div>

      <div className="max-h-96 space-y-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="group rounded-xl px-3 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  msg.own
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
                sendMessage();
              }
            }}
            placeholder="Napíš správu..."
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />

          <button
            onClick={sendMessage}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
          >
            Odoslať
          </button>
        </div>
      </div>
    </div>
  );
}