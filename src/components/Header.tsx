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
    <header className="flex h-[76px] items-center justify-between border-b border-green-200 bg-white px-10">
      <div className="flex items-center gap-3 text-2xl font-extrabold text-green-800">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-white shadow">
          <Building2 size={28} />
        </div>
        <span>Virtuálna kancelária</span>
      </div>

      {loggedUserEmail ? (
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            {loggedUserEmail}
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white shadow transition hover:bg-orange-600"
          >
            Odhlásiť
          </button>
        </div>
      ) : (
        <button
          onClick={openAuth}
          className="flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow transition hover:bg-orange-600"
        >
          <UserRound size={22} />
          Prihlásenie
        </button>
      )}
    </header>
  );
}