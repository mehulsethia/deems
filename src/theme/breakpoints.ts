import { layout } from './tokens';

/**
 * Pure layout rules from the window size. Never from orientation or device type: on iPhone Duo the
 * window changes size on fold/unfold and the inner display ignores supported orientations.
 */
export interface LayoutInfo {
  width: number;
  height: number;
  /** Width of the centred content column. */
  contentWidth: number;
  /** Two panes side by side (visual | text), split on the centre line. */
  spread: boolean;
  /** Not much vertical room (phone landscape, small phones): secondary footer text scrolls. */
  short: boolean;
  /** Narrow phone (iPhone SE class and below). */
  narrow: boolean;
  /** Multiplier for headline sizes, 0.86..1.12. */
  headlineScale: number;
  /** Desktop web layout inside the web view (iPad, Mac, tablets). */
  isWide: boolean;
  webWidth: number;
}

export const BREAKPOINTS = {
  /** Two panes need at least this much width... */
  spreadMinWidth: 600,
  /** ...and to be landscape-ish, or very wide. Portrait unfolded iPhone Duo (≈669×951) stays one column. */
  spreadAspect: 1.05,
  spreadAlwaysWidth: 1000,
  maxSpreadWidth: 1040,
  shortHeight: 640,
  narrowWidth: 360,
} as const;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function layoutFor(width: number, height: number): LayoutInfo {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const spread = w >= BREAKPOINTS.spreadMinWidth && (w / Math.max(1, h) >= BREAKPOINTS.spreadAspect || w >= BREAKPOINTS.spreadAlwaysWidth);
  const contentWidth = Math.min(w, spread ? BREAKPOINTS.maxSpreadWidth : layout.maxContentWidth);
  const isWide = w >= layout.wideBreakpoint;
  return {
    width: w,
    height: h,
    contentWidth,
    spread,
    short: h < BREAKPOINTS.shortHeight,
    narrow: w < BREAKPOINTS.narrowWidth,
    // Based on the shorter side, so landscape phones do not get giant headlines.
    headlineScale: Math.round(clamp(Math.min(w, h) / 390, 0.86, 1.12) * 100) / 100,
    isWide,
    webWidth: isWide ? Math.min(w, layout.webMaxWidth) : w,
  };
}
