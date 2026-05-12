import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, Video } from "lucide-react";

import { useOffice } from "../context/OfficeContext";
import { useUserSettings } from "../context/UserSettingsContext";

type DMMessage = {
  id: number;
  fromUserId: number;
  fromUserName: string;
  text: string;
  time: string;
};

function getStorageKey(firstId: number, secondId: number) {
  const firstUserId = Math.min(firstId, secondId);
  const secondUserId = Math.max(firstId, secondId);

  return `dm-${firstUserId}-${secondUserId}`;
}

export default function DirectMessage() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const { employees } = useOffice();
  const { activeUserId } = useUserSettings();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeUser = employees.find((item) => item.id === activeUserId);
  const recipient = employees.find((item) => item.id === Number(employeeId));

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<DMMessage[]>([]);

  const recipientId = Number(employeeId);
  const storageKey = getStorageKey(activeUserId, recipientId);

  useEffect(() => {
    if (!activeUser || !recipient) return;

    const savedMessages = localStorage.getItem(storageKey);

    try {
      const parsedMessages: DMMessage[] = savedMessages
        ? JSON.parse(savedMessages)
        : [];

      setMessages(parsedMessages);
    } catch {
      setMessages([]);
    }

    setInputValue("");
  }, [activeUser?.id, recipient?.id, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function sendMessage() {
    if (!inputValue.trim() || !activeUser || !recipient) return;

    const now = new Date();

    const newMessage: DMMessage = {
      id: Date.now(),
      fromUserId: activeUser.id,
      fromUserName: activeUser.name,
      text: inputValue.trim(),
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
    setInputValue("");
  }

  if (!activeUser || !recipient || Number.isNaN(recipientId)) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Konverzácia nenájdená
        </h2>

        <button
          onClick={() => navigate("/messages")}
          className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
        >
          Späť na správy
        </button>
      </div>
    );
  }

  const isSelfChat = activeUser.id === recipient.id;

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/messages")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-lg font-black text-white">
              {recipient.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                {recipient.name}
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Píšeš ako{" "}
                <span className="font-bold text-green-700 dark:text-green-400">
                  {activeUser.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <Phone size={18} />
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <Video size={18} />
          </button>
        </div>
      </div>

      {isSelfChat && (
        <div className="border-b border-yellow-100 bg-yellow-50 px-6 py-3 text-sm font-semibold text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/20 dark:text-yellow-300">
          Máš otvorený chat sám so sebou. Prepni aktívneho používateľa v sidebare,
          ak chceš testovať správu medzi dvomi rôznymi osobami.
        </div>
      )}

      <div className="max-h-[540px] min-h-[420px] space-y-4 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
        {messages.length === 0 && (
          <div className="flex min-h-[360px] items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Send size={22} />
              </div>

              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                Začni konverzáciu
              </h3>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Napíš prvú správu pre {recipient.name}.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.fromUserId === activeUser.id;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isOwn
                    ? "bg-green-600 text-white"
                    : "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
                }`}
              >
                <div
                  className={`mb-1 text-xs font-bold ${
                    isOwn ? "text-green-100" : "text-zinc-500"
                  }`}
                >
                  {message.fromUserName}
                  {isOwn ? " · ty" : ""}
                </div>

                <p className="text-sm leading-relaxed">{message.text}</p>

                <p
                  className={`mt-2 text-right text-xs ${
                    isOwn ? "text-green-100" : "text-zinc-400"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
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
            placeholder={`Napíš správu pre ${recipient.name}...`}
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
  );
}