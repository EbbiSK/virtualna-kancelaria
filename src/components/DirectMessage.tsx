import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, Video } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

type DMMessage = {
  id: number;
  text: string;
  own: boolean;
  time: string;
};

export default function DirectMessage() {
  const navigate = useNavigate();

  const { employeeId } = useParams();

  const { employees } = useOffice();

  const employee = employees.find(
    (item) => item.id === Number(employeeId)
  );

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<DMMessage[]>([]);

  const storageKey = `dm-${employeeId}`;

  useEffect(() => {
    if (!employee) return;

    const savedMessages = localStorage.getItem(storageKey);

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          id: 1,
          text: `Ahoj, toto je súkromný chat s ${employee.name}.`,
          own: false,
          time: "09:00",
        },
      ]);
    }
  }, [employee, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  function sendMessage() {
    if (!inputValue.trim()) return;

    const now = new Date();

    const newMessage: DMMessage = {
      id: Date.now(),
      text: inputValue,
      own: true,
      time: now.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  }

  if (!employee) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Zamestnanec nenájdený
        </h2>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/employee/${employee.id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-lg font-black text-white">
              {employee.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                {employee.name}
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {employee.role}
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

      <div className="max-h-[540px] min-h-[420px] space-y-4 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.own ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.own
                  ? "bg-green-600 text-white"
                  : "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>

              <p
                className={`mt-2 text-right text-xs ${
                  message.own
                    ? "text-green-100"
                    : "text-zinc-400"
                }`}
              >
                {message.time}
              </p>
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
            placeholder={`Napíš správu pre ${employee.name}...`}
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