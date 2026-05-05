type IconName =
  | "document"
  | "person"
  | "room"
  | "tool"
  | "action"
  | "search"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "history"
  | "spark"
  | "close";

type Props = {
  name: IconName;
  className?: string;
};

function iconFor(name: IconName) {
  switch (name) {
    case "document":
      return "📄";
    case "person":
      return "👤";
    case "room":
      return "🏢";
    case "tool":
      return "🧰";
    case "action":
      return "⚡";
    case "search":
      return "🔎";
    case "success":
      return "✅";
    case "info":
      return "ℹ️";
    case "warning":
      return "⚠️";
    case "error":
      return "⛔";
    case "history":
      return "🕘";
    case "spark":
      return "✨";
    case "close":
      return "✕";
    default:
      return "•";
  }
}

export function AppIcon({ name, className = "" }: Props) {
  return <span className={className}>{iconFor(name)}</span>;
}