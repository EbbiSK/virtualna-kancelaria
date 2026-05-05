import { useEffect, useState } from "react";

export const PROFILE_KEY = "virtualna-kancelaria-profile";
export const PROFILE_UPDATED_EVENT = "virtualna-kancelaria-profile-updated";

export type UserProfileData = {
  name: string;
  avatar: string;
};

const DEFAULT_PROFILE: UserProfileData = {
  name: "Používateľ",
  avatar: "🙂",
};

const AVATARS = ["🙂", "🧑‍💻", "👨‍💼", "👩‍💼", "🎨", "🚀", "🐱", "🐶"];

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

  const [editingName, setEditingName] = useState(profile.name);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
      <div className="mb-4 text-lg font-bold">Profil</div>

      <div className="mb-4 flex items-center gap-3">
        <div className="text-3xl">{profile.avatar}</div>

        <input
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          className="rounded border px-2 py-1"
        />

        <button
          onClick={() =>
            setProfile((prev) => ({
              ...prev,
              name: editingName.trim() || "Používateľ",
            }))
          }
          className="rounded bg-slate-900 px-3 py-1 text-white"
        >
          Uložiť
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            onClick={() => setProfile((prev) => ({ ...prev, avatar }))}
            className={[
              "rounded border px-2 py-1 text-xl",
              profile.avatar === avatar
                ? "border-slate-900 bg-slate-100"
                : "border-slate-300",
            ].join(" ")}
          >
            {avatar}
          </button>
        ))}
      </div>
    </div>
  );
}