import { UserAvatar } from "./virtual-office/UserAvatar";
import { getPresenceMeta } from "../lib/virtualOffice";
import type { Person } from "../types/virtualOffice";

type TopHeaderProps = {
  currentUser: Person | null;
};

export function TopHeader({ currentUser }: TopHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-2xl font-medium text-slate-400">
          Virtuálna kancelária
        </p>
        <h1 className="mt-2 text-6xl font-semibold tracking-tight text-white">
          Miestnosti
        </h1>
        <p className="mt-4 max-w-3xl text-2xl text-slate-400">
          Mapa slúži ako vstup do miestnosti. Klikni na room a vpravo sa otvorí
          pracovný priestor.
        </p>
      </div>

      {currentUser ? (
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#111c31] px-4 py-3">
          <UserAvatar
            name={currentUser.name}
            presence={currentUser.presence}
          />
          <div>
            <p className="text-lg font-semibold text-white">
              {currentUser.name}
            </p>
            <p className="text-base text-emerald-400">
              {getPresenceMeta(currentUser.presence).label}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}