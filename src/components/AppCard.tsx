import type { ReactNode } from "react";
import { theme } from "../theme";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  elevated?: boolean;
};

export function AppCard({
  children,
  className = "",
  padded = true,
  elevated = false,
}: Props) {
  return (
    <div
      className={[
        theme.radius.card,
        "border",
        theme.colors.borderBase,
        theme.colors.surfaceBase,
        padded ? theme.spacing.card : "",
        elevated ? theme.shadow.card : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}