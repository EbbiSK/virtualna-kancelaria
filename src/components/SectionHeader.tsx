import type { ReactNode } from "react";
import { theme } from "../theme";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className={`text-sm font-semibold ${theme.colors.textStrong}`}>
          {title}
        </h2>

        {subtitle ? (
          <p className={`mt-1 text-xs ${theme.colors.textFaint}`}>
            {subtitle}
          </p>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}