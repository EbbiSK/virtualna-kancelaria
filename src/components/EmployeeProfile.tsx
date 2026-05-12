import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Mail, User, Video } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const { employees, rooms } = useOffice();

  const employee = employees.find(
    (item) => item.id === Number(employeeId)
  );

  if (!employee) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Zamestnanec nenájdený
        </h2>

        <button
          onClick={() => navigate("/settings")}
          className="mt-6 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
        >
          Späť do nastavení
        </button>
      </div>
    );
  }

  const room = rooms.find((item) => item.id === employee.roomId);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/settings")}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <ArrowLeft size={16} />
        Späť
      </button>

      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-green-600 text-4xl font-black text-white">
            {employee.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white">
              {employee.name}
            </h1>

            <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
              {employee.role}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <User className="text-green-700 dark:text-green-400" size={22} />

          <h3 className="mt-4 font-black text-zinc-900 dark:text-white">
            Pozícia
          </h3>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {employee.role}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Building2 className="text-green-700 dark:text-green-400" size={22} />

          <h3 className="mt-4 font-black text-zinc-900 dark:text-white">
            Miestnosť
          </h3>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {room ? room.name : "Bez miestnosti"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Mail className="text-green-700 dark:text-green-400" size={22} />

          <h3 className="mt-4 font-black text-zinc-900 dark:text-white">
            Kontakt
          </h3>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {employee.name.toLowerCase()}@ebbi.sk
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">
          Rýchle akcie
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            onClick={() => navigate("/chat")}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-5 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
          >
            <Mail className="text-green-700 dark:text-green-400" size={20} />

            <p className="mt-3 font-bold text-zinc-900 dark:text-white">
              Poslať správu
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Otvor firemný chat
            </p>
          </button>

          <button
            onClick={() =>
              room ? navigate(`/rooms/${room.name.toLowerCase()}/meeting`) : navigate("/rooms")
            }
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-5 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800 dark:hover:bg-zinc-800"
          >
            <Video className="text-green-700 dark:text-green-400" size={20} />

            <p className="mt-3 font-bold text-zinc-900 dark:text-white">
              Spustiť meeting
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Otvor miestnosť zamestnanca
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}