import type { ReactNode } from "react";
import { theme } from "../theme";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  shortcuts?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  eyebrow,
  title,
  description,
  shortcuts,
  children,
}: Props) {
  return (
    <div
      className={`min-h-screen bg-[${theme.colors.pageBg}] text-white antialiased`}
      style={{ backgroundColor: theme.colors.pageBg }}
    >
      <div className={`mx-auto max-w-7xl ${theme.spacing.page}`}>
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-white/35">
            {eyebrow}
          </p>

          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                {description}
              </p>
            </div>

            {shortcuts ? (
              <div className="flex flex-wrap gap-2 text-xs text-white/40">
                {shortcuts}
              </div>
            ) : null}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}