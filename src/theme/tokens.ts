/**
 * Deems brand tokens. The single source of truth for colour, type, shape and motion.
 * Dark-first. No gradients, glows, or shadows tinted with brand colours.
 * Blue and magenta never sit directly on each other as text and background.
 */

/** Raw brand palette. Components use the semantic `colors` below, not these. */
export const palette = {
  // Brand
  blue: '#1463FF',
  blueOnDark: '#5B93FF',
  magenta: '#E4257A',
  magentaText: '#D81B72',
  magentaOnDark: '#FF5C9F',
  ink: '#0E0F12',
  // Neutrals
  surface: '#17191E',
  hairline: '#2A2D34',
  white: '#FFFFFF',
  mist: '#F1F2F5',
  slate: '#5C6370',
  slateOnDark: '#B4B9C2',
  // Tints (light surfaces only)
  blueTint: '#E6EEFF',
  blueTintText: '#0B3FB0',
  magentaTint: '#FCE6F0',
  magentaTintText: '#9C0F50',
  // The MESSAGES value on the receipt (blue text on white paper).
  receiptKept: '#0B4FD6',
} as const;

export const colors = {
  // Dark surfaces
  background: palette.ink,
  surface: palette.surface,
  hairline: palette.hairline,

  // Text on dark
  text: palette.white,
  textMuted: palette.slateOnDark,

  /** Primary action, selected state, things you keep: fills and outlines. */
  primary: palette.blue,
  onPrimary: palette.white,
  /** Blue as text, links or thin lines on dark surfaces. */
  primaryOnDark: palette.blueOnDark,

  /** Struck-off and removed items, highlights: fills and strikes. */
  removed: palette.magenta,
  /** Magenta as text or thin lines on dark surfaces. */
  removedOnDark: palette.magentaOnDark,
  /** Magenta carrying text on white, or under white text (the REFUNDED stamp). */
  removedText: palette.magentaText,
  onRemoved: palette.white,

  /** Secondary button on dark: white fill, ink label. */
  inverse: palette.white,
  onInverse: palette.ink,

  // Receipt paper
  paper: palette.white,
  onPaper: palette.ink,
  paperKept: palette.receiptKept,

  // Light surfaces (not used by the dark app yet; kept for completeness)
  lightSurface: palette.mist,
  textOnLight: palette.ink,
  textMutedOnLight: palette.slate,
  blueTint: palette.blueTint,
  onBlueTint: palette.blueTintText,
  magentaTint: palette.magentaTint,
  onMagentaTint: palette.magentaTintText,

  /** Dims content behind sheets. */
  scrim: 'rgba(14,15,18,0.72)',
  /** Neutral black shadow; never brand-tinted. */
  shadow: '#000000',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;

/** Fills for the drawn avatars in the illustration, taken from the palette only. */
export const avatarTints = [colors.primary, colors.removed, colors.paper, colors.textMuted] as const;

export const fonts = {
  headline: 'BricolageGrotesque_700Bold',
  headlineHeavy: 'BricolageGrotesque_800ExtraBold',
  body: 'Geist_400Regular',
  bodyMedium: 'Geist_500Medium',
  bodySemi: 'Geist_600SemiBold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoBold: 'GeistMono_700Bold',
} as const;

/** Headlines: -2% tracking, line height 1.04. Mono labels: +6% tracking, caps. */
const headline = (fontSize: number, fontFamily: string = fonts.headline) => ({
  fontFamily,
  fontSize,
  lineHeight: Math.round(fontSize * 1.04),
  letterSpacing: -0.02 * fontSize,
});
const label = (fontSize: number) => ({
  fontFamily: fonts.monoMedium,
  fontSize,
  lineHeight: Math.round(fontSize * 1.35),
  letterSpacing: 0.06 * fontSize,
  textTransform: 'uppercase' as const,
});

export const typeScale = {
  display: headline(40, fonts.headlineHeavy),
  title: headline(32),
  heading: headline(22),
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 17, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fonts.bodySemi, fontSize: 17, lineHeight: 22 },
  mono: { fontFamily: fonts.mono, fontSize: 15, lineHeight: 21 },
  receipt: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, letterSpacing: 0.06 * 13 },
  label: label(12),
  readout: { fontFamily: fonts.monoMedium, fontSize: 48, lineHeight: 56, letterSpacing: -0.5 },
} as const;

export type TypeVariant = keyof typeof typeScale;

export const radius = {
  card: 16,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const sizes = {
  button: 56,
  touch: 44,
  progress: 2,
  hairline: 1,
  /** Screen side padding. */
  gutter: 24,
} as const;

/** Dynamic Type scales text up to 130%. */
export const MAX_FONT_SCALE = 1.3;

export const motion = {
  fast: 200,
  base: 300,
  slow: 450,
  /** Receipt printing: one line every 250 ms. */
  printLine: 250,
} as const;

/** Content max width on wide layouts (iPad / Mac). */
export const layout = {
  maxContentWidth: 560,
  wideBreakpoint: 700,
  /** Web content (desktop layout) on iPad / Mac. */
  webMaxWidth: 880,
} as const;
