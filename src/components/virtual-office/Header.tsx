import { Building2, UserRound } from "lucide-react";

type HeaderProps = {
  loggedUserEmail: string | null;
  logout: () => void;
  openAuth: () => void;
};

export default function Header({
  loggedUserEmail,
  logout,
  openAuth,
}: HeaderProps) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 px-10">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <Building2 size={32} />
        <span>Virtuálna kancelária</span>
      </div>

      {loggedUserEmail ? (
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium">
            {loggedUserEmail}
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-lg font-medium shadow-sm"
          >
            Odhlásiť
          </button>
        </div>
      ) : (
        <button
          onClick={openAuth}
          className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3 text-lg font-medium shadow-sm"
        >
          <UserRound size={22} />
          Prihlásenie
        </button>
      )}
    </header>
  );
}