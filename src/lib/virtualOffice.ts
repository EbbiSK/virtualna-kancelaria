import type { MessageAttachment, Presence, Room } from "../types/virtualOffice";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function createAttachment(file: File): MessageAttachment {
  const isImage = file.type.startsWith("image/");

  return {
    kind: isImage ? "image" : "file",
    name: file.name,
    sizeLabel: formatFileSize(file.size),
    mimeType: file.type || "application/octet-stream",
    url: URL.createObjectURL(file),
  };
}

export function getPresenceMeta(presence: Presence) {
  switch (presence) {
    case "online":
      return {
        dot: "bg-emerald-400",
        label: "Online",
        badge: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
      };
    case "away":
      return {
        dot: "bg-amber-400",
        label: "Away",
        badge: "border-amber-400/20 bg-amber-500/10 text-amber-300",
      };
    default:
      return {
        dot: "bg-slate-500",
        label: "Offline",
        badge: "border-slate-500/20 bg-slate-500/10 text-slate-300",
      };
  }
}

export function getRoomTone(status: Room["status"]) {
  switch (status) {
    case "active":
      return {
        card: "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.10)]",
        pill: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20",
        label: "Aktívna",
      };
    case "quiet":
      return {
        card: "border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]",
        pill: "bg-blue-500/15 text-blue-300 border border-blue-400/20",
        label: "Tichšia",
      };
    default:
      return {
        card: "border-slate-600 bg-slate-700/20",
        pill: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
        label: "Voľná",
      };
  }
}

export function getDirectThreadKey(a: string, b: string) {
  return [a, b].sort().join("__");
}