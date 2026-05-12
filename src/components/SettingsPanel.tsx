import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, UserPlus, Building2, Moon, Sun } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

type SettingsPanelProps = {
  avatar: string;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
};

export default function SettingsPanel({
  avatar,
  onAvatarUpload,
  onRemoveAvatar,
  darkMode = false,
  setDarkMode,
}: SettingsPanelProps) {
  const navigate = useNavigate();

  const {
    rooms,
    employees,
    addRoom,
    deleteRoom,
    addEmployee,
    deleteEmployee,
    changeEmployeeRoom,
  } = useOffice();

  const [newRoomName, setNewRoomName] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("");

  function handleAddRoom() {
    addRoom(newRoomName);
    setNewRoomName("");
  }

  function handleAddEmployee() {
    addEmployee(newEmployeeName, newEmployeeRole);
    setNewEmployeeName("");
    setNewEmployeeRole("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
          Nastavenia
        </h2>

        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Správa profilu, miestností, zamestnancov a vzhľadu aplikácie.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">
            Profil používateľa
          </h3>

          <div className="mt-6 flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-green-600 text-4xl font-black text-white">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                "J"
              )}
            </div>

            <div className="space-y-3">
              <label className="inline-flex cursor-pointer rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400">
                Nahrať avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarUpload}
                  className="hidden"
                />
              </label>

              {avatar && (
                <button
                  onClick={onRemoveAvatar}
                  className="ml-3 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Odstrániť
                </button>
              )}
            </div>
          </div>
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

      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="flex items-center gap-2 text-xl font-black text-zinc-900 dark:text-white">
          <UserPlus size={20} />
          Zamestnanci
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={newEmployeeName}
            onChange={(event) => setNewEmployeeName(event.target.value)}
            placeholder="Meno"
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />

          <input
            value={newEmployeeRole}
            onChange={(event) => setNewEmployeeRole(event.target.value)}
            placeholder="Pozícia"
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />

          <button
            onClick={handleAddEmployee}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
          >
            <Plus size={16} />
            Pridať zamestnanca
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="grid cursor-pointer grid-cols-1 gap-3 rounded-xl bg-zinc-50 p-4 transition hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 md:grid-cols-[1fr_220px_auto]"
              onClick={() => navigate(`/employee/${employee.id}`)}
            >
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">
                  {employee.name}
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {employee.role}
                </p>
              </div>

              <select
                value={employee.roomId}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) =>
                  changeEmployeeRoom(employee.id, event.target.value)
                }
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="">Bez miestnosti</option>

                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  deleteEmployee(employee.id);
                }}
                className="rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}