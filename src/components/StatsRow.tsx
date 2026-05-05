import { Bell, Building2, PhoneCall, Users } from "lucide-react";

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
  tone: "green" | "blue" | "violet" | "amber";
}) {
  const toneMap = {
    green: "bg-emerald-500/20 text-emerald-300",
    blue: "bg-blue-500/20 text-blue-300",
    violet: "bg-violet-500/20 text-violet-300",
    amber: "bg-amber-500/20 text-amber-300",
  };

  return (
    <div className="rounded-[28px] border border-white/8 bg-[#111c31] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-4">
        <div className={["rounded-2xl p-3", toneMap[tone]].join(" ")}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
      </div>
    </div>
  );
}

type StatsRowProps = {
  onlineCount: number;
  peopleCount: number;
  activeRooms: number;
  roomsCount: number;
  activeCalls: number;
  freeRooms: number;
};

export function StatsRow({
  onlineCount,
  peopleCount,
  activeRooms,
  roomsCount,
  activeCalls,
  freeRooms,
}: StatsRowProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <StatCard
        icon={<Users size={24} />}
        label="Online ľudia"
        value={onlineCount}
        hint={`z ${peopleCount}`}
        tone="green"
      />
      <StatCard
        icon={<Building2 size={24} />}
        label="Aktívne miestnosti"
        value={activeRooms}
        hint={`z ${roomsCount}`}
        tone="blue"
      />
      <StatCard
        icon={<PhoneCall size={24} />}
        label="Hovory prebiehajú"
        value={activeCalls}
        hint="miestnosť"
        tone="violet"
      />
      <StatCard
        icon={<Bell size={24} />}
        label="Voľné miestnosti"
        value={freeRooms}
        hint="k dispozícii"
        tone="amber"
      />
    </div>
  );
}