import type { FontVariant } from 'react-native';

/**
 * OnlyDM brand tokens. The single source of truth for colour, type, shape and motion.
 * Same system as getonlydm.com: black and white, dark-first. The only colour in the app is the two dots in
 * the OnlyDM mark and the official Meta logos. No coloured gradients, glows or tinted shadows.
 */

/** Raw brand palette. Components use the semantic `colors` below, not these. */
export const palette = {
  // Greyscale (matches the site)
  black: '#0A0A0A',
  ink: '#171717',
  graphite: '#3D3D3D',
  grey: '#6B6B6B',
  silver: '#A3A3A3',
  line: '#E5E5E5',
  lineDark: '#262626',
  paper: '#F5F5F5',
  white: '#FFFFFF',
  // The mark only: its two coloured dots and its bubble ink. Never used for UI.
  markBlue: '#1463FF',
  markMagenta: '#E4257A',
  markInk: '#0E0F12',
} as const;

export const colors = {
  // Dark surfaces
  background: palette.black,
  surface: palette.ink,
  hairline: palette.lineDark,

  // Text on dark
  text: palette.white,
  /** Secondary text on dark (silver, 8:1 on black). */
  textMuted: palette.silver,

  /** Primary action, selected state, progress, things you keep: white on black, like the site's inverted buttons. */
  primary: palette.white,
  onPrimary: palette.black,
  /** White as text, links or thin lines on dark surfaces. */
  primaryOnDark: palette.white,

  /** Struck-off and removed items: grey strikes and fills, never coloured. */
  removed: palette.grey,
  /** Removed items as text or thin lines on dark surfaces. */
  removedOnDark: palette.silver,
  /** Solid fill carrying white text (the REFUNDED stamp), and removed text on white. */
  removedText: palette.black,
  onRemoved: palette.white,

  /** Secondary button: outline only, white label. */
  inverse: palette.white,
  onInverse: palette.black,

  // Receipt paper
  paper: palette.white,
  onPaper: palette.black,
  paperKept: palette.black,

  // Light surfaces (the receipt and light illustrations)
  lightSurface: palette.paper,
  textOnLight: palette.black,
  textMutedOnLight: palette.grey,

  /** Dims content behind sheets. */
  scrim: 'rgba(10,10,10,0.72)',
  /** Neutral black shadow. */
  shadow: '#000000',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;

/**
 * Inter for structure, with heavy weights for headlines and numbers. A rounded face (Nunito) for chat-like
 * text. Bricolage stays only for the OnlyDM wordmark; Geist Mono only for the printed receipt.
 */
export const fonts = {
  headlineRegular: 'BricolageGrotesque_400Regular',
  /** Wordmark "DM". */
  brandHeavy: 'BricolageGrotesque_800ExtraBold',
  headline: 'Inter_800ExtraBold',
  headlineHeavy: 'Inter_900Black',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  chat: 'Nunito_600SemiBold',
  chatBold: 'Nunito_800ExtraBold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoBold: 'GeistMono_700Bold',
} as const;

/** Headlines: tight tracking (-4%), line height 1.05. Labels: Inter caps with +12% tracking. */
const headline = (fontSize: number, fontFamily: string = fonts.headline) => ({
  fontFamily,
  fontSize,
  lineHeight: Math.round(fontSize * 1.05),
  letterSpacing: -0.04 * fontSize,
});
const label = (fontSize: number) => ({
  fontFamily: fonts.bodySemi,
  fontSize,
  lineHeight: Math.round(fontSize * 1.35),
  letterSpacing: 0.12 * fontSize,
  textTransform: 'uppercase' as const,
});

const TABULAR: FontVariant[] = ['tabular-nums'];

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
  /** Chat-like text: rounded, tracking left at 0 so long threads don't feel cramped. */
  chat: { fontFamily: fonts.chat, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  receipt: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, letterSpacing: 0.06 * 13 },
  label: label(12),
  /** Big numbers (time readouts): crisp, heavy, tabular. */
  readout: { fontFamily: fonts.headlineHeavy, fontSize: 48, lineHeight: 54, letterSpacing: -1.5, fontVariant: TABULAR },
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
