import { UserAvatar } from "./UserAvatar";
import type { Person } from "../../types/virtualOffice";

type MiniAvatarRowProps = {
  people: Person[];
};

export function MiniAvatarRow({ people }: MiniAvatarRowProps) {
  return (
    <div className="flex items-center gap-2">
      {people.slice(0, 2).map((person) => (
        <UserAvatar
          key={person.id}
          name={person.name}
          presence={person.presence}
          compact
        />
      ))}

      {people.length > 2 ? (
        <span className="flex h-9 min-w-[36px] items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-slate-200">
          +{people.length - 2}
        </span>
      ) : null}
    </div>
  );
}