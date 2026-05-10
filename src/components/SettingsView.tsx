import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { Room } from "../types";
import UserProfile from "./UserProfile";

type EditableRoomKey = "name" | "createdAt" | "meetingTerm" | "projectName";

type SettingsViewProps = {
  rooms: Room[];
  newRoomName: string;
  setNewRoomName: (value: string) => void;
  addRoom: () => void;
  updateRoom: (id: string, key: EditableRoomKey, value: string) => void;
  deleteRoom: (id: string) => void;
  addPerson: (roomId: string) => void;
  removePerson: (roomId: string, personId: string) => void;
  goHome: () => void;
};

const DARK_MODE_KEY = "virtualna-kancelaria-dark-mode";

export default function SettingsView({
  rooms,
  newRoomName,
  setNewRoomName,
  addRoom,
  updateRoom,
  deleteRoom,
  addPerson,
  removePerson,
  goHome,
}: SettingsViewProps) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(DARK_MODE_KEY) === "true";
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <main className="mx-auto max-w-3xl p-10">
      <button
        onClick={goHome}
        className="mb-6 rounded border px-4 py-2"
      >
        ← späť
      </button>

      <h1 className="mb-6 text-3xl font-bold">Nastavenia</h1>

      <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow">
        <div>
          <div className="text-lg font-bold">Vzhľad aplikácie</div>
          <div className="text-sm text-slate-500">
            Prepínanie medzi svetlou a tmavou témou
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-2"
        >
          <Sun size={18} />

          <div
            className={[
              "relative h-6 w-11 rounded-full transition",
              darkMode ? "bg-slate-950" : "bg-slate-300",
            ].join(" ")}
          >
            <div
              className={[
                "absolute top-1 h-4 w-4 rounded-full bg-white transition",
                darkMode ? "left-6" : "left-1",
              ].join(" ")}
            />
          </div>

          <Moon size={18} />
        </button>
      </div>

      <div className="mb-8">
        <UserProfile />
      </div>

      <div className="mb-6 flex gap-2">
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Nová miestnosť"
          className="w-full rounded border px-3 py-2"
        />

        <button
          onClick={addRoom}
          className="rounded border px-4"
        >
          Pridať
        </button>
      </div>

      {rooms.map((room) => (
        <div key={room.id} className="mb-4 rounded border p-4">
          <input
            value={room.name}
            onChange={(e) =>
              updateRoom(room.id, "name", e.target.value)
            }
            className="mb-3 w-full text-lg font-bold"
          />

          <label className="block text-sm">Dátum vzniku</label>

          <input
            type="date"
            value={room.createdAt}
            onChange={(e) =>
              updateRoom(room.id, "createdAt", e.target.value)
            }
            className="mb-3 w-full border px-2 py-1"
          />

          <label className="block text-sm">Termín porád</label>

          <input
            value={room.meetingTerm}
            onChange={(e) =>
              updateRoom(room.id, "meetingTerm", e.target.value)
            }
            className="mb-3 w-full border px-2 py-1"
          />

          <label className="block text-sm">Projekt</label>

          <input
            value={room.projectName}
            onChange={(e) =>
              updateRoom(room.id, "projectName", e.target.value)
            }
            className="mb-3 w-full border px-2 py-1"
          />

          {room.people.map((person) => (
            <div key={person.id} className="flex justify-between">
              <span>{person.name}</span>

              <button
                onClick={() => removePerson(room.id, person.id)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          ))}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => addPerson(room.id)}
              className="rounded border px-3 py-1"
            >
              + zamestnanec
            </button>

            <button
              onClick={() => deleteRoom(room.id)}
              className="rounded border px-3 py-1 text-red-500"
            >
              zrušiť miestnosť
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}