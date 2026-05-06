import { useEffect, useState } from "react";

export const PROFILE_KEY = "virtualna-kancelaria-profile";
export const PROFILE_UPDATED_EVENT = "virtualna-kancelaria-profile-updated";

export type UserProfileData = {
  firstName: string;
  lastName: string;
  avatar?: string;
};

const DEFAULT_PROFILE: UserProfileData = {
  firstName: "",
  lastName: "",
  avatar: "",
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
      return JSON.parse(saved) as UserProfileData;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
      <div className="mb-4 text-lg font-bold">Profil</div>

      {/* AVATAR */}
      <div className="mb-4 flex items-center gap-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="avatar"
            className="h-16 w-16 rounded-full object-cover border"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-sm text-slate-500">
            bez foto
          </div>
        )}

        <label className="cursor-pointer rounded border px-3 py-2 text-sm hover:bg-slate-50">
          Nahrať fotku
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>

      {/* MENO */}
      <div className="mb-3">
        <label className="block text-sm text-slate-500">Meno</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* PRIEZVISKO */}
      <div className="mb-4">
        <label className="block text-sm text-slate-500">Priezvisko</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* SAVE */}
      <button
        onClick={() =>
          setProfile({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            avatar: profile.avatar,
          })
        }
        className="rounded bg-slate-900 px-4 py-2 text-white"
      >
        Uložiť
      </button>
    </div>
  );
}