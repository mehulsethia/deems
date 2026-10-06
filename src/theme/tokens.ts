/**
 * Deems brand tokens. The single source of truth for colour, type, shape and motion.
 * Dark-first and dark-only for now. No gradients, glows or blue.
 */

export const colors = {
  background: '#0B0B0C',
  surface: '#151517',
  /** Primary text, and the receipt's paper colour. */
  paper: '#F4F1EA',
  muted: '#8C8A84',
  /** Electric lime: primary buttons, things you keep. */
  keep: '#C6FF3D',
  /** Signal orange: struck-off items, warnings. */
  cut: '#FF5A36',
  hairline: '#26262A',
  /** Text on lime, and text on the paper receipt. */
  ink: '#0B0B0C',
  /** Dims content behind sheets. */
  scrim: 'rgba(11,11,12,0.72)',
  shadow: '#000000',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;

/** Fills for the drawn avatars in the illustration, taken from the palette only. */
export const avatarTints = [colors.keep, colors.cut, colors.paper, colors.muted] as const;

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
