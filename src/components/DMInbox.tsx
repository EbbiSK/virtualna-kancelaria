import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

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

export default function DMInbox() {
  const navigate = useNavigate();

  const { employees } = useOffice();
  const { activeUserId } = useUserSettings();

  const activeUser = employees.find((employee) => employee.id === activeUserId);

  const conversations = employees
    .filter((employee) => employee.id !== activeUserId)
    .map((employee) => {
      const storageKey = getStorageKey(activeUserId, employee.id);
      const savedMessages = localStorage.getItem(storageKey);

      const messages: DMMessage[] = savedMessages
        ? JSON.parse(savedMessages)
        : [];

      const lastMessage = messages[messages.length - 1];

      return {
        employee,
        lastMessage,
        hasMessages: messages.length > 0,
      };
    });

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Správy
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Priame správy pre používateľa{" "}
          <span className="font-bold text-green-700 dark:text-green-400">
            {activeUser?.name || "Neznámy používateľ"}
          </span>
        </p>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {conversations.map(({ employee, lastMessage, hasMessages }) => (
          <button
            key={employee.id}
            onClick={() => navigate(`/employee/${employee.id}/chat`)}
            className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-lg font-black text-white">
              {employee.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-zinc-900 dark:text-white">
                  {employee.name}
                </h3>

                {lastMessage && (
                  <span className="text-xs font-semibold text-zinc-400">
                    {lastMessage.time}
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                {hasMessages
                  ? `${lastMessage.fromUserName}: ${lastMessage.text}`
                  : "Zatiaľ žiadne správy"}
              </p>
            </div>

            <MessageCircle
              size={18}
              className="text-zinc-400"
            />
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400">
            Najprv pridaj ďalších zamestnancov v nastaveniach.
          </div>
        )}
      </div>
    </div>
  );
}