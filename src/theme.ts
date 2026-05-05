export const theme = {
  colors: {
    pageBg: "#07111A",
    panelBg: "#0B1621",
    textPrimary: "text-white",
    textStrong: "text-white/90",
    textMuted: "text-white/60",
    textSoft: "text-white/45",
    textFaint: "text-white/35",

    borderBase: "border-white/10",
    borderSoft: "border-white/8",
    surfaceBase: "bg-white/[0.03]",
    surfaceSoft: "bg-white/[0.04]",
    surfaceHover: "bg-white/[0.07]",

    emeraldBorder: "border-emerald-400/20",
    emeraldBg: "bg-emerald-500/12",
    emeraldHoverBorder: "hover:border-emerald-400/30",
    emeraldHoverBg: "hover:bg-emerald-500/18",
    emeraldText: "text-emerald-200",
    emeraldRing: "focus:ring-emerald-400/25",

    skyBorder: "border-sky-400/20",
    skyBg: "bg-sky-500/12",
    skyText: "text-sky-200",

    amberBorder: "border-amber-400/15",
    amberBg: "bg-amber-500/10",
    amberHoverBorder: "hover:border-amber-400/25",
    amberHoverBg: "hover:bg-amber-500/15",
    amberText: "text-amber-200",
    amberRing: "focus:ring-amber-400/20",
  },

  radius: {
    card: "rounded-[24px]",
    panel: "rounded-[20px]",
    buttonSm: "rounded-xl",
    buttonLg: "rounded-2xl",
    pill: "rounded-full",
  },

  shadow: {
    card: "shadow-2xl shadow-black/20",
    emerald: "shadow-[0_10px_30px_rgba(16,185,129,0.10)]",
    sky: "shadow-[0_10px_30px_rgba(14,165,233,0.10)]",
  },

  focus: {
    base: "focus:outline-none focus:ring-2",
    white: "focus:ring-white/15",
    subtle: "focus:ring-white/10",
  },

  transition: {
    base: "transition-all duration-200",
  },

  spacing: {
    page: "px-6 py-10",
    card: "p-4",
    panel: "p-5",
  },
} as const;