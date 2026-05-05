import type { ButtonHTMLAttributes, ReactNode } from "react";
import { theme } from "../theme";

type AppButtonVariant =
  | "primary"
  | "secondary"
  | "subtle"
  | "warning"
  | "ghost";

type AppButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

function getVariantClasses(variant: AppButtonVariant) {
  switch (variant) {
    case "primary":
      return [
        theme.colors.emeraldBorder,
        theme.colors.emeraldBg,
        theme.colors.emeraldText,
        theme.colors.emeraldHoverBorder,
        theme.colors.emeraldHoverBg,
        theme.colors.emeraldRing,
      ].join(" ");

    case "secondary":
      return [
        theme.colors.borderBase,
        "bg-white/[0.06]",
        theme.colors.textStrong,
        "hover:border-white/15",
        "hover:bg-white/[0.09]",
        theme.focus.white,
      ].join(" ");

    case "subtle":
      return [
        theme.colors.borderBase,
        theme.colors.surfaceSoft,
        theme.colors.textMuted,
        "hover:border-white/15",
        theme.colors.surfaceHover,
        "hover:text-white/85",
        theme.focus.white,
      ].join(" ");

    case "warning":
      return [
        theme.colors.amberBorder,
        theme.colors.amberBg,
        theme.colors.amberText,
        theme.colors.amberHoverBorder,
        theme.colors.amberHoverBg,
        theme.colors.amberRing,
      ].join(" ");

    case "ghost":
      return [
        "border-transparent",
        "bg-transparent",
        theme.colors.textMuted,
        "hover:border-white/10",
        "hover:bg-white/[0.05]",
        "hover:text-white/85",
        theme.focus.subtle,
      ].join(" ");

    default:
      return "";
  }
}

function getSizeClasses(size: AppButtonSize) {
  switch (size) {
    case "sm":
      return `min-h-9 ${theme.radius.buttonSm} px-3 py-2 text-xs`;
    case "md":
      return `min-h-10 ${theme.radius.buttonSm} px-3.5 py-2.5 text-sm`;
    case "lg":
      return `min-h-12 ${theme.radius.buttonLg} px-4 py-3 text-sm`;
    default:
      return "";
  }
}

export function AppButton({
  variant = "subtle",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 border font-medium",
        theme.transition.base,
        theme.focus.base,
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:-translate-y-[1px]",
        getVariantClasses(variant),
        getSizeClasses(size),
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span className="truncate">{children}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  );
}