import { useEffect, useState } from "react";

export const PROFILE_KEY = "virtualna-kancelaria-profile";
export const PROFILE_UPDATED_EVENT = "virtualna-kancelaria-profile-updated";

export type UserProfileData = {
  firstName: string;
  lastName: string;
  photo: string;
};

const DEFAULT_PROFILE: UserProfileData = {
  firstName: "",
  lastName: "",
  photo: "",
};

function saveProfile(profile: UserProfileData) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (!saved) return DEFAULT_PROFILE;

    try {
      const parsed = JSON.parse(saved);
      return {
        firstName: parsed.firstName || parsed.name || "",
        lastName: parsed.lastName || "",
        photo: parsed.photo || parsed.avatar || "",
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        photo: String(reader.result || ""),
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
      <div className="mb-4 text-lg font-bold">Profil</div>

      <div className="mb-5 flex items-center gap-4">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt="Profilová fotka"
            className="h-16 w-16 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
            Foto
          </div>
        )}

        <label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          Pridať fotku
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
          />
        </label>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-slate-500">Meno</label>
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Meno"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-slate-500">Priezvisko</label>
        <input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Priezvisko"
        />
      </div>

      <button
        onClick={() =>
          setProfile((prev) => ({
            ...prev,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }))
        }
        className="rounded-xl bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800"
      >
        Uložiť
      </button>
    </div>
  );
}