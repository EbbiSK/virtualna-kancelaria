import type { ReactNode } from "react";
import { AppIcon } from "./AppIcon";
import { theme } from "../theme";

type Props = {
  icon?: "search" | "history" | "spark";
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  icon = "search",
  title,
  description,
  action,
  compact = false,
}: Props) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        theme.radius.panel,
        "border border-dashed",
        theme.colors.borderBase,
        theme.colors.surfaceBase,
        compact ? "min-h-[120px] py-8 px-6" : "min-h-[320px] py-10 px-6",
      ].join(" ")}
    >
      <AppIcon name={icon} className="text-4xl" />

      <h3 className={`mt-4 text-base font-semibold ${theme.colors.textStrong}`}>
        {title}
      </h3>

      <p
        className={`mt-2 max-w-xs text-sm leading-6 ${theme.colors.textSoft}`}
      >
        {description}
      </p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}