import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { useOffice } from "../context/OfficeContext";

export default function EmployeeProfile() {
  const navigate = useNavigate();

  const { employeeId } = useParams();

  const { employees } = useOffice();

  const employee = employees.find(
    (item) => item.id === Number(employeeId)
  );

  if (!employee) {
    return (
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          Používateľ neexistuje
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <ArrowLeft size={16} />
        Späť
      </button>

      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-green-600 text-5xl font-black text-white">
            {employee.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              {employee.name}
            </h1>

            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
              Profil používateľa
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <User size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Krstné meno
              </p>

              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                {employee.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <User size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Priezvisko
              </p>

              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                Placeholder
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Mail size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Email
              </p>

              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                {employee.email}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Phone size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Telefónne číslo
              </p>

              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                +421 900 000 000
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}