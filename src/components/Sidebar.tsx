import {
  Bell,
  Building2,
  Calendar,
  File,
  Home,
  MessageCircle,
  Phone,
  Settings,
  X,
} from "lucide-react";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
};

function SidebarItem({
  icon,
  label,
  active = false,
  badge,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      className={[
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition",
        active
          ? "bg-[#2b2b66] text-white"
          : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
      ].join(" ")}
    >
      <span className="flex items-center gap-3">
        <span className="text-slate-300">{icon}</span>
        <span className="text-[17px] font-medium">{label}</span>
      </span>

      {badge ? (
        <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function Sidebar() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col rounded-[28px] border border-white/8 bg-[#111c31] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="rounded-2xl bg-violet-500/20 p-2 text-violet-300">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xl font-semibold text-white">Virtuálna kancelária</p>
          </div>
        </div>

        <div className="space-y-2">
          <SidebarItem icon={<Home size={18} />} label="Prehľad" active />
          <SidebarItem icon={<Building2 size={18} />} label="Miestnosti" />
          <SidebarItem
            icon={<MessageCircle size={18} />}
            label="Priame správy"
            badge={3}
          />
          <SidebarItem icon={<File size={18} />} label="Súbory" />
          <SidebarItem icon={<Phone size={18} />} label="Hovory" />
          <SidebarItem icon={<Calendar size={18} />} label="Kalendár" />
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-6">
        <SidebarItem icon={<Settings size={18} />} label="Nastavenia" />
        <SidebarItem icon={<X size={18} />} label="Odhlásiť sa" />
      </div>
    </div>
  );
}