import { useState } from "react";
import { Plus, Trash2, Building2 } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

type SettingsPanelProps = {
  avatar: string;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
};

export default function SettingsPanel() {
  const { rooms, addRoom, deleteRoom } = useOffice();

  const [newRoomName, setNewRoomName] = useState("");

  function handleAddRoom() {
    addRoom(newRoomName);
    setNewRoomName("");
  }

  return (
    <div className="pt-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="flex items-center gap-3 text-3xl font-black text-zinc-900 dark:text-white">
          <Building2 size={28} className="text-green-700 dark:text-green-400" />
          Miestnosti
        </h2>

        <div className="mt-8 flex gap-4">
          <input
            value={newRoomName}
            onChange={(event) => setNewRoomName(event.target.value)}
            placeholder="Názov miestnosti"
            className="flex-1 rounded-2xl border border-green-200 bg-white px-5 py-4 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />

          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-7 py-4 text-sm font-black text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
          >
            <Plus size={18} />
            Pridať
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-2xl bg-zinc-50 px-6 py-5 dark:bg-zinc-950"
            >
              <span className="text-lg font-black text-green-800 dark:text-green-400">
                {room.name}
              </span>

              <button
                onClick={() => deleteRoom(room.id)}
                className="rounded-xl p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}