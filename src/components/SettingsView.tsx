import { Upload } from "lucide-react";
import { useState } from "react";
import type { Room } from "../types";

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

const COMPANY_NAME_KEY = "virtual-office-company-name";
const COMPANY_LOGO_KEY = "virtual-office-company-logo";

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
  const [companyLogo, setCompanyLogo] = useState<string | null>(() =>
    localStorage.getItem(COMPANY_LOGO_KEY)
  );

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);

      localStorage.setItem(COMPANY_LOGO_KEY, result);
      setCompanyLogo(result);
      window.dispatchEvent(new Event("storage"));
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="mx-auto max-w-4xl p-10">
      <button
        onClick={goHome}
        className="mb-6 rounded-2xl border border-green-200 bg-white px-5 py-3 font-medium shadow"
      >
        ← späť
      </button>

      <h1 className="mb-8 text-4xl font-extrabold text-green-800">
        Nastavenia
      </h1>

      <div className="mb-8 rounded-3xl border border-green-200 bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-green-800">
          Firemná identita
        </h2>

        <div className="mb-6 flex items-center gap-5">
          <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 transition hover:bg-green-100">
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleLogoUpload(file);
                }

                event.target.value = "";
              }}
            />

            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Logo firmy"
                className="h-20 w-20 object-contain"
              />
            ) : (
              <>
                <Upload size={28} className="mb-2 text-green-700" />
                <div className="text-center text-sm font-black text-green-700">
                  VLOŽIŤ
                  <br />
                  LOGO
                </div>
              </>
            )}
          </label>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-bold text-green-700">
              Názov firmy
            </label>

            <input
              type="text"
              defaultValue={
                localStorage.getItem(COMPANY_NAME_KEY) ||
                "Virtuálna kancelária"
              }
              placeholder="Názov firmy"
              className="w-full rounded-2xl border border-green-200 px-4 py-3"
              onChange={(event) => {
                localStorage.setItem(COMPANY_NAME_KEY, event.target.value);
                window.dispatchEvent(new Event("storage"));
              }}
            />

            <p className="mt-2 text-sm text-slate-500">
              Logo a názov sa zobrazia v hornom menu aplikácie.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-3">
        <input
          value={newRoomName}
          onChange={(event) => setNewRoomName(event.target.value)}
          placeholder="Nová miestnosť"
          className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 shadow"
        />

        <button
          onClick={addRoom}
          className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow transition hover:bg-orange-600"
        >
          Pridať
        </button>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl border border-green-200 bg-white p-6 shadow"
          >
            <input
              value={room.name}
              onChange={(event) =>
                updateRoom(room.id, "name", event.target.value)
              }
              className="mb-5 w-full text-2xl font-extrabold"
            />

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Dátum vzniku
              </label>

              <input
                type="date"
                value={room.createdAt}
                onChange={(event) =>
                  updateRoom(room.id, "createdAt", event.target.value)
                }
                className="w-full rounded-xl border border-green-200 px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Termín porád
              </label>

              <input
                value={room.meetingTerm}
                onChange={(event) =>
                  updateRoom(room.id, "meetingTerm", event.target.value)
                }
                className="w-full rounded-xl border border-green-200 px-3 py-2"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">Projekt</label>

              <input
                value={room.projectName}
                onChange={(event) =>
                  updateRoom(room.id, "projectName", event.target.value)
                }
                className="w-full rounded-xl border border-green-200 px-3 py-2"
              />
            </div>

            <div className="mb-5 space-y-2">
              {room.people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3"
                >
                  <span>{person.name}</span>

                  <button
                    onClick={() => removePerson(room.id, person.id)}
                    className="rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => addPerson(room.id)}
                className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow transition hover:bg-orange-600"
              >
                + zamestnanec
              </button>

              <button
                onClick={() => deleteRoom(room.id)}
                className="rounded-2xl border border-red-300 bg-red-50 px-5 py-3 font-bold text-red-600"
              >
                zrušiť miestnosť
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}