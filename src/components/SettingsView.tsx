import type { Room } from "../types";

type EditableRoomKey =
  | "name"
  | "createdAt"
  | "meetingTerm"
  | "projectName";

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

      {/* NÁZOV FIRMY */}
      <div className="mb-8 rounded-3xl border border-green-200 bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-green-800">
          Názov firmy
        </h2>

        <input
          type="text"
          defaultValue={
            localStorage.getItem("virtual-office-company-name") ||
            "Virtuálna kancelária"
          }
          placeholder="Názov firmy"
          className="mb-4 w-full rounded-2xl border border-green-200 px-4 py-3"
          onChange={(e) => {
            localStorage.setItem(
              "virtual-office-company-name",
              e.target.value
            );

            window.dispatchEvent(new Event("storage"));
          }}
        />

        <p className="text-sm text-slate-500">
          Tento názov sa zobrazí v hornom menu aplikácie.
        </p>
      </div>

      {/* PRIDANIE MIESTNOSTI */}
      <div className="mb-8 flex gap-3">
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
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

      {/* ZOZNAM MIESTNOSTÍ */}
      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl border border-green-200 bg-white p-6 shadow"
          >
            <input
              value={room.name}
              onChange={(e) =>
                updateRoom(room.id, "name", e.target.value)
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
                onChange={(e) =>
                  updateRoom(room.id, "createdAt", e.target.value)
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
                onChange={(e) =>
                  updateRoom(room.id, "meetingTerm", e.target.value)
                }
                className="w-full rounded-xl border border-green-200 px-3 py-2"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Projekt
              </label>

              <input
                value={room.projectName}
                onChange={(e) =>
                  updateRoom(room.id, "projectName", e.target.value)
                }
                className="w-full rounded-xl border border-green-200 px-3 py-2"
              />
            </div>

            {/* ĽUDIA */}
            <div className="mb-5 space-y-2">
              {room.people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3"
                >
                  <span>{person.name}</span>

                  <button
                    onClick={() =>
                      removePerson(room.id, person.id)
                    }
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