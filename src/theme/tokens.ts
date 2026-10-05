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

const brand = {
  primary: '#1F3A2E',
  accent: '#D9622B',
} as const;

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#F6F1E7',
    card: '#FFFFFF',
    text: '#1B1A17',
    muted: '#8A8578',
    primary: brand.primary,
    onPrimary: '#F6F1E7',
    accent: brand.accent,
    onAccent: '#FFFFFF',
    border: '#E4DDCE',
    overlay: 'rgba(27,26,23,0.4)',
  },
  dark: {
    background: '#121512',
    card: '#1C211D',
    text: '#F1ECE2',
    muted: '#8A8578',
    primary: brand.primary,
    onPrimary: '#F1ECE2',
    accent: brand.accent,
    onAccent: '#FFFFFF',
    border: '#2A312B',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

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
} as const;
