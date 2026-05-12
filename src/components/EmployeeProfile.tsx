import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Save, Upload, User } from "lucide-react";

import { useOffice } from "../context/OfficeContext";

type SavedProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
};

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const { employees } = useOffice();

  const employee = employees.find((item) => item.id === Number(employeeId));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const storageKey = `employee-profile-${employeeId}`;

  useEffect(() => {
    if (!employee) return;

    const savedProfile = localStorage.getItem(storageKey);

    if (savedProfile) {
      const parsedProfile: SavedProfile = JSON.parse(savedProfile);

      setFirstName(parsedProfile.firstName);
      setLastName(parsedProfile.lastName);
      setEmail(parsedProfile.email);
      setPhone(parsedProfile.phone);
      setPhoto(parsedProfile.photo);
    } else {
      setFirstName(employee.name || "");
      setLastName("");
      setEmail(employee.email || "");
      setPhone("");
      setPhoto("");
    }
  }, [employee, storageKey]);

  function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    const profile: SavedProfile = {
      firstName,
      lastName,
      email,
      phone,
      photo,
    };

    localStorage.setItem(storageKey, JSON.stringify(profile));
  }

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
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-green-600 text-5xl font-black text-white">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profilová fotka"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstName.charAt(0) || employee.name.charAt(0)
                )}
              </div>

              <label className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700">
                <Upload size={14} />
                Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                {firstName || "Profil"}
              </h1>

              <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
                Profil používateľa
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-sm font-black text-white transition hover:bg-green-700"
          >
            <Save size={18} />
            Uložiť
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-3 flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <User size={18} />
            Krstné meno
          </label>

          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Krstné meno"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-3 flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <User size={18} />
            Priezvisko
          </label>

          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Priezvisko"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-3 flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <Mail size={18} />
            Email
          </label>

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@ebbi.sk"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-3 flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <Phone size={18} />
            Telefónne číslo
          </label>

          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+421 900 000 000"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}