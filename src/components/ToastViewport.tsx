import { AppButton } from "./AppButton";
import { AppIcon } from "./AppIcon";
import { theme } from "../theme";

export type ToastVariant = "success" | "info" | "warning" | "error";

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type Props = {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
};

function getStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return {
        icon: "success" as const,
        border: theme.colors.emeraldBorder,
        bar: "bg-emerald-500/80",
      };
    case "info":
      return {
        icon: "info" as const,
        border: theme.colors.skyBorder,
        bar: "bg-sky-500/80",
      };
    case "warning":
      return {
        icon: "warning" as const,
        border: theme.colors.amberBorder,
        bar: "bg-amber-500/80",
      };
    case "error":
      return {
        icon: "error" as const,
        border: "border-rose-400/20",
        bar: "bg-rose-500/80",
      };
  }
}

export function ToastViewport({ toasts, onDismiss }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const styles = getStyles(toast.variant);

        return (
          <div
            key={toast.id}
            className={[
              "pointer-events-auto overflow-hidden",
              theme.radius.panel,
              "border bg-[#0B1621]/95 backdrop-blur-xl",
              theme.shadow.card,
              styles.border,
            ].join(" ")}
          >
            <div className="flex items-start gap-3 p-4">
              <AppIcon name={styles.icon} className="mt-0.5 text-base" />

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>
                  {toast.title}
                </p>

                {toast.description ? (
                  <p className={`mt-1 text-xs ${theme.colors.textSoft}`}>
                    {toast.description}
                  </p>
                ) : null}
              </div>

              <AppButton
                variant="subtle"
                size="sm"
                onClick={() => onDismiss(toast.id)}
              >
                Zavrieť
              </AppButton>
            </div>

            <div className={`h-1 w-full ${styles.bar}`} />
          </div>
        );
      })}
    </div>
  );
}