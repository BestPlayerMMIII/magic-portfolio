import type { ThemeUiConfig } from "../../../types/3d";

// WIZARD LABORATORY THEME - UI CONFIGURATION
// All colors, gradients, borders, and visual tokens for dark and light modes.
export const wizardLabUi: ThemeUiConfig = {
  dark: {
    // Page / Canvas Backgrounds
    pageBackground: "bg-slate-950 text-slate-100",
    pageBackgroundHex: "#020617",

    // 3D Scene Background & Fog
    sceneClearColor: 0x0a0d16,
    sceneFogColor: 0x0f1322,
    sceneFogNear: 10,
    sceneFogFar: 50,

    // Header in 3D Scene (Frosted dark slate with warm amber glow)
    header3DBackground:
      "bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-xl",
    header3DTitle: "text-slate-100",
    header3DSubtitle: "text-amber-200/80",
    header3DButtonBg:
      "bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/60 text-slate-200 hover:border-amber-500/40",
    header3DLogoButton: "bg-slate-900 border-slate-700 text-amber-300",

    // Standard Navigation Header (2D pages)
    navHeaderBackground:
      "bg-slate-950/85 backdrop-blur-md border-b border-slate-800 shadow-xl",
    navHeaderTitle: "text-slate-100",
    navHeaderSubtitle: "text-amber-200/80",
    navHeaderLink: "text-slate-300 hover:bg-white/10 hover:text-amber-200",
    navHeaderLinkActive:
      "bg-slate-800 text-amber-300 border border-amber-400/30",
    navHeaderButtonBg:
      "bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/60 text-slate-200 hover:border-amber-500/40",
    navHeaderLogoButton: "bg-slate-900 border-slate-700 text-amber-300",

    // Panels & Cards
    panelBackground: "bg-slate-900/95 backdrop-blur-xl",
    panelBorder: "border-slate-800",
    panelTitle: "text-white font-bold",
    panelText: "text-slate-200",
    panelTextMuted: "text-slate-400",
    panelCloseButton:
      "text-slate-300 hover:text-white bg-white/10 hover:bg-white/20",
    cardBackground: "bg-slate-900/80 backdrop-blur-md",
    cardBorder: "border-slate-800",
    cardHoverBorder: "hover:border-amber-500/40",
    cardTitle: "text-white font-bold",
    cardText: "text-slate-200",
    cardTextMuted: "text-slate-400",
    proseClass: "mode-dark prose-invert text-slate-100",

    // Buttons
    primaryButtonBg: "bg-amber-500",
    primaryButtonHover: "hover:bg-amber-400",
    primaryButtonText: "text-slate-950 font-bold",
    primaryGradient: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300",
    primaryGradientText: "text-slate-950 font-bold",
    secondaryButtonBg: "bg-slate-900/80",
    secondaryButtonBorder: "border-slate-700/60",
    secondaryButtonText: "text-slate-200",

    // Accents & Badges
    accentColor: "text-amber-300",
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/30",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent)",
    badgeBg: "bg-slate-900",
    badgeText: "text-slate-300",
    badgeBorder: "border-slate-700",

    // Ready State Badges
    readyBadgeBg: "bg-emerald-950/60",
    readyBadgeText: "text-emerald-400",
    readyBadgeBorder: "border-emerald-500/30",
    readyBadgeDot: "bg-emerald-400",

    // Preloader UI
    preloaderBackdrop: "bg-slate-950/95 backdrop-blur-xl",
    preloaderTitle: "text-white font-bold",
    preloaderSubtitle: "text-slate-400",
    preloaderCardBorder: "border-slate-800",
    preloaderStatusBadge: "bg-slate-900 text-slate-300 border-slate-700",
    preloaderProgressTrack: "bg-slate-900 border-slate-800",
    preloaderStatusText: "text-slate-300",
    preloaderStatusMuted: "text-slate-400",

    // Ambient Overlay in 3D scene
    ambientOverlay: {
      radial1: "rgba(99, 102, 241, 0.06)",
      radial2: "rgba(245, 158, 11, 0.05)",
    },

    // Scrollbar
    scrollbarThumb: "rgba(245, 158, 11, 0.3)",
    scrollbarThumbHover: "rgba(245, 158, 11, 0.55)",
    scrollbarTrack: "rgba(15, 23, 42, 0.6)",
  },

  light: {
    // Page / Canvas Backgrounds
    pageBackground: "bg-stone-100 text-stone-900",
    pageBackgroundHex: "#f5f5f4",

    // 3D Scene Background & Fog (Warm atmospheric sepia/parchment daylight - NEVER harsh pure white!)
    sceneClearColor: 0x24201c,
    sceneFogColor: 0x2a2520,
    sceneFogNear: 10,
    sceneFogFar: 50,

    // Header in 3D Scene (Softly frosted translucent overlay that blends gently into the 3D scene)
    header3DBackground:
      "bg-stone-900/40 backdrop-blur-md border-b border-stone-600/30 shadow-lg",
    header3DTitle: "text-amber-100 font-bold",
    header3DSubtitle: "text-amber-200/90",
    header3DButtonBg:
      "bg-stone-900/60 hover:bg-stone-800/80 border-stone-600/40 text-amber-100 hover:border-amber-400/50",
    header3DLogoButton: "bg-amber-900/30 border-amber-500/40 text-amber-300",

    // Standard Navigation Header (2D pages)
    navHeaderBackground:
      "bg-stone-100/95 backdrop-blur-md border-b border-stone-300 shadow-sm",
    navHeaderTitle: "text-stone-950 font-bold",
    navHeaderSubtitle: "text-stone-600",
    navHeaderLink:
      "text-stone-800 hover:bg-stone-200 hover:text-amber-800 font-medium",
    navHeaderLinkActive:
      "bg-amber-100 text-amber-900 font-semibold border border-amber-300/60",
    navHeaderButtonBg:
      "bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-800 hover:border-amber-300 shadow-sm",
    navHeaderLogoButton: "bg-amber-100 border-amber-300 text-amber-800",

    // Panels & Cards (High-contrast light styling: SOLID, completely opaque background, no transparency bleed!)
    panelBackground: "bg-stone-50 shadow-2xl",
    panelBorder: "border-stone-300",
    panelTitle: "text-stone-950 font-bold",
    panelText: "text-stone-900",
    panelTextMuted: "text-stone-600",
    panelCloseButton:
      "text-stone-700 hover:text-stone-950 bg-stone-200 hover:bg-stone-300 border border-stone-300",
    cardBackground: "bg-white shadow-2xl",
    cardBorder: "border-stone-300",
    cardHoverBorder: "hover:border-amber-600/60",
    cardTitle: "text-stone-950 font-bold",
    cardText: "text-stone-900",
    cardTextMuted: "text-stone-600",
    proseClass: "mode-light text-stone-950",

    // Buttons
    primaryButtonBg: "bg-amber-600",
    primaryButtonHover: "hover:bg-amber-500",
    primaryButtonText: "text-white font-bold",
    primaryGradient: "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400",
    primaryGradientText: "text-white font-bold",
    secondaryButtonBg: "bg-stone-200/90",
    secondaryButtonBorder: "border-stone-300",
    secondaryButtonText: "text-stone-900",

    // Accents & Badges
    accentColor: "text-amber-800",
    accentBg: "bg-amber-100",
    accentBorder: "border-amber-300",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.4), transparent)",
    badgeBg: "bg-stone-200",
    badgeText: "text-stone-800",
    badgeBorder: "border-stone-300",

    // Ready State Badges
    readyBadgeBg: "bg-emerald-100",
    readyBadgeText: "text-emerald-800",
    readyBadgeBorder: "border-emerald-300",
    readyBadgeDot: "bg-emerald-600",

    // Preloader UI (Harmonious with 3D realm and warm frosted amber top bar)
    preloaderBackdrop: "bg-stone-900/90 backdrop-blur-xl",
    preloaderTitle: "text-amber-100 font-bold",
    preloaderSubtitle: "text-amber-200/90",
    preloaderCardBorder: "border-stone-700/60",
    preloaderStatusBadge: "bg-stone-900/90 text-amber-200 border-stone-700/60",
    preloaderProgressTrack: "bg-stone-950 border-stone-800",
    preloaderStatusText: "text-amber-100 font-medium",
    preloaderStatusMuted: "text-amber-200/80",

    // Ambient Overlay in 3D scene
    ambientOverlay: {
      radial1: "rgba(245, 158, 11, 0.04)",
      radial2: "rgba(217, 119, 6, 0.03)",
    },

    // Scrollbar
    scrollbarThumb: "rgba(180, 83, 9, 0.35)",
    scrollbarThumbHover: "rgba(180, 83, 9, 0.6)",
    scrollbarTrack: "rgba(245, 245, 244, 0.8)",
  },

  preloaderProgressGradient:
    "from-amber-500 via-amber-400 to-amber-300",
};

export default wizardLabUi;
