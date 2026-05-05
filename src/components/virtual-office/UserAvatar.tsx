import { getInitials, getPresenceMeta } from "../../lib/virtualOffice";
import type { Presence } from "../../types/virtualOffice";

type UserAvatarProps = {
  name: string;
  presence?: Presence;
  compact?: boolean;
};

export function UserAvatar({
  name,
  presence,
  compact = false,
}: UserAvatarProps) {
  const meta = presence ? getPresenceMeta(presence) : null;

  return (
    <div className="relative shrink-0">
      <div
        className={[
          "flex items-center justify-center rounded-full font-semibold text-white ring-1 ring-white/10",
          compact ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm",
          "bg-gradient-to-br from-emerald-500 to-blue-500",
        ].join(" ")}
      >
        {getInitials(name)}
      </div>

      {meta ? (
        <span
          className={[
            "absolute bottom-0 right-0 rounded-full border-2 border-[#111c31]",
            compact ? "h-3 w-3" : "h-3.5 w-3.5",
            meta.dot,
          ].join(" ")}
        />
      ) : null}
    </div>
  );
}