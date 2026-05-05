import { Building2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PROFILE_KEY,
  PROFILE_UPDATED_EVENT,
  type UserProfileData,
} from "./UserProfile";

type HeaderProps = {
  loggedUserEmail: string | null;
  logout: () => void;
  openAuth: () => void;
};

const DEFAULT_PROFILE: UserProfileData = {
  name: "Používateľ",
  avatar: "🙂",
};

function loadProfile(): UserProfileData {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (!saved) return DEFAULT_PROFILE;

  try {
    return JSON.parse(saved) as UserProfileData;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function Header({
  loggedUserEmail,
  logout,
  openAuth,
}: HeaderProps) {
  const [profile, setProfile] = useState<UserProfileData>(() => loadProfile());

  useEffect(() => {
    const updateProfile = () => {
      setProfile(loadProfile());
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, updateProfile);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, updateProfile);
    };
  }, []);

  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 px-10">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <Building2 size={32} />
        <span>Virtuálna kancelária</span>
      </div>

      {loggedUserEmail ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-2">
            <div className="text-2xl">{profile.avatar}</div>
            <div className="text-sm font-medium">{profile.name}</div>
          </div>

          <div className="rounded-xl border border-slate-300 px-4 py-2 text-sm">
            {loggedUserEmail}
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-slate-300 px-5 py-2"
          >
            Odhlásiť
          </button>
        </div>
      ) : (
        <button
          onClick={openAuth}
          className="flex items-center gap-3 rounded-xl border border-slate-300 px-6 py-3"
        >
          <UserRound size={22} />
          Prihlásenie
        </button>
      )}
    </header>
  );
}