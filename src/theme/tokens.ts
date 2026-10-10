import type { FontVariant } from 'react-native';

/**
 * OnlyDM brand tokens. The single source of truth for colour, type, shape and motion.
 * Light glass: white base, near-black ink, like getonlydm.com. UI colours stay greyscale. The only colour in
 * the UI is the OnlyDM mark and the official Meta logos; the soft pastel glow lives in `atmosphere` (backdrop
 * only) and `platformBloom` (halo behind a selected tile).
 */

/** Raw brand palette. Components use the semantic `colors` below, not these. */
export const palette = {
  // Greyscale (matches the site)
  black: '#0A0A0A',
  ink: '#171717',
  graphite: '#3D3D3D',
  slate: '#595959',
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
  // Light surfaces
  background: palette.white,
  surface: palette.white,
  hairline: palette.line,

  // Frosted glass (cards, icon buttons)
  glassFill: 'rgba(255,255,255,0.72)',
  /** 1px highlight along the top edge of glass. */
  glassEdge: 'rgba(255,255,255,0.95)',
  glassBorder: 'rgba(10,10,10,0.07)',

  // Text on light
  text: palette.black,
  /** Secondary text (grey, 5.3:1 on white). */
  textMuted: palette.grey,

  /** Primary action, selected state, progress: near-black on white. */
  primary: palette.black,
  onPrimary: palette.white,
  /** Links and thin accents. Name kept from the dark theme so call sites do not change. */
  primaryOnDark: palette.black,

  /** Disabled primary button: pale fill, readable label. */
  disabledFill: palette.line,
  disabledText: palette.slate,

  /** Struck-off and removed items: grey. */
  removed: palette.grey,
  removedOnDark: palette.grey,
  removedText: palette.black,
  onRemoved: palette.white,

  /** Secondary button: glass pill, ink label. */
  inverse: palette.black,
  onInverse: palette.white,

  // Receipt paper (lifted with a shadow on the light screen)
  paper: palette.white,
  onPaper: palette.black,
  paperKept: palette.black,

  lightSurface: palette.paper,
  textOnLight: palette.black,
  textMutedOnLight: palette.grey,

  /** Dims content behind sheets. */
  scrim: 'rgba(10,10,10,0.35)',
  /** Neutral black shadow. */
  shadow: '#000000',
  transparent: 'transparent',
} as const;

/** Backdrop glow (blue, violet, pink: the three logo dots). Never used for UI elements. */
export const atmosphere = {
  tint: '#F7F8FB',
  blue: '#BFD4FF',
  violet: '#D9C9FF',
  pink: '#FFCFE3',
} as const;

/** Soft halo behind a selected platform tile. */
export const platformBloom = {
  instagram: '#F7A8C8',
  threads: '#C9CCD6',
  messenger: '#A9C8FF',
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
  headline: 'Inter_600SemiBold',
  headlineHeavy: 'Inter_700Bold',
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

/** Headlines: SemiBold, tracking -3%, line height 1.1. Labels: Inter caps with +12% tracking. */
const headline = (fontSize: number, fontFamily: string = fonts.headline) => ({
  fontFamily,
  fontSize,
  lineHeight: Math.round(fontSize * 1.1),
  letterSpacing: -0.03 * fontSize,
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
  display: headline(42, fonts.headline),
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
  readout: { fontFamily: fonts.headline, fontSize: 56, lineHeight: 62, letterSpacing: -2, fontVariant: TABULAR },
} as const;

export type TypeVariant = keyof typeof typeScale;

export const radius = {
  card: 22,
  tile: 28,
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
  progress: 3,
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
  /** The inbox column on tablets and desktops: phone width, so the platforms show their phone layout. */
  webMaxWidth: 520,
} as const;

/** Site easing as Easing.bezier control points. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const springs = {
  press: { damping: 18, stiffness: 320, mass: 0.6 },
  sheet: { damping: 22, stiffness: 180, mass: 1 },
} as const;
