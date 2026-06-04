export const colors = {
  // Brand
  navy:          "#071B63",
  navyDark:      "#031244",
  aqua:          "#10D5D2",
  cyan:          "#59E3FF",

  // Surfaces
  bgPage:        "#F8FBFD",
  bgSoft:        "#EEF8FF",
  surface:       "#FFFFFF",
  muted:         "#F3F7FA",

  // Text
  textPrimary:   "#061849",
  textSecondary: "#52627A",
  textMuted:     "#97AEC4",

  // Border
  border:        "#DCEAF5",

  // Status
  success:       "#22C55E",
  warning:       "#F59E0B",
  danger:        "#EF4444",
  orange:        "#F97316",
} as const

export type ColorKey = keyof typeof colors
