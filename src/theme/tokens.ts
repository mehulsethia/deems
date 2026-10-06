export type ColorScheme = 'light' | 'dark';

export interface Palette {
  background: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  border: string;
  overlay: string;
}

/** Flat violet and pink on white; no gradients. */
const brand = {
  primary: '#7B3FE4',
  accent: '#DB3A82',
} as const;

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#FAF7FD',
    card: '#FFFFFF',
    text: '#1A1523',
    muted: '#7D7690',
    primary: brand.primary,
    onPrimary: '#FFFFFF',
    accent: brand.accent,
    onAccent: '#FFFFFF',
    border: '#E8E0F2',
    overlay: 'rgba(26,21,35,0.4)',
  },
  dark: {
    background: '#130F1A',
    card: '#1D1726',
    text: '#F3EEFA',
    muted: '#9A93AD',
    primary: brand.primary,
    onPrimary: '#FFFFFF',
    accent: brand.accent,
    onAccent: '#FFFFFF',
    border: '#2D2438',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

/** Soft tints for the drawn avatars in the illustrated mock screens. */
export const avatarTints = ['#F4B6D2', '#C9B6F2', '#B8C8F5', '#F7CDB8', '#D8B4F0'] as const;

export const radius = {
  card: 14,
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

export const fonts = {
  heading: 'Fraunces_600SemiBold',
  headingRegular: 'Fraunces_400Regular',
  body: 'InstrumentSans_400Regular',
  bodyMedium: 'InstrumentSans_500Medium',
  bodySemi: 'InstrumentSans_600SemiBold',
} as const;

export const typeScale = {
  display: { fontSize: 40, lineHeight: 46 },
  title: { fontSize: 28, lineHeight: 34 },
  heading: { fontSize: 20, lineHeight: 26 },
  body: { fontSize: 17, lineHeight: 24 },
  small: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
} as const;

/** Slow, calm motion: 300-500ms ease-out. */
export const motion = {
  fast: 300,
  base: 400,
  slow: 500,
} as const;

/** Content max width on wide layouts (iPad / Mac). */
export const layout = {
  maxContentWidth: 560,
  wideBreakpoint: 700,
  /** Web content (Instagram desktop layout) on iPad / Mac. */
  webMaxWidth: 880,
} as const;
