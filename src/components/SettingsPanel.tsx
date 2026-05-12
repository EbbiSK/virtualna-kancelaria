import { useState } from "react";
import { Plus, Trash2, Building2, Moon, Sun } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

type SettingsPanelProps = {
  avatar: string;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
};

export default function SettingsPanel({
  darkMode = false,
  setDarkMode,
}: SettingsPanelProps) {
  const {
    rooms,
    addRoom,
    deleteRoom,
  } = useOffice();

  const [newRoomName, setNewRoomName] = useState("");

  function handleAddRoom() {
    addRoom(newRoomName);
    setNewRoomName("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
          Nastavenia
        </h2>

        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Správa miestností a vzhľadu aplikácie.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white">
          Vzhľad aplikácie
        </h3>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Prepni svetlý alebo tmavý režim.
        </p>

        <button
          onClick={() => setDarkMode?.(!darkMode)}
          className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-green-300 hover:bg-green-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode
            ? "Prepnúť na svetlý režim"
            : "Prepnúť na tmavý režim"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="flex items-center gap-2 text-xl font-black text-zinc-900 dark:text-white">
          <Building2 size={20} />
          Miestnosti
        </h3>

        <div className="mt-5 flex gap-3">
          <input
            value={newRoomName}
            onChange={(event) => setNewRoomName(event.target.value)}
            placeholder="Názov miestnosti"
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />

          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
          >
            <Plus size={16} />
            Pridať
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950"
            >
              <span className="font-bold text-zinc-900 dark:text-white">
                {room.name}
              </span>

              <button
                onClick={() => deleteRoom(room.id)}
                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}