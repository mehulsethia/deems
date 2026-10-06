import { colors, palette } from '../src/theme/tokens';

/** WCAG relative luminance contrast ratio. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const BODY = 4.5;
const GRAPHIC = 3;

describe('brand contrast: text pairs the app uses (4.5:1)', () => {
  const pairs: [string, string, string][] = [
    ['text on background', colors.text, colors.background],
    ['text on surface', colors.text, colors.surface],
    ['muted text on background', colors.textMuted, colors.background],
    ['muted text on surface', colors.textMuted, colors.surface],
    ['primary button label', colors.onPrimary, colors.primary],
    ['secondary button label', colors.onInverse, colors.inverse],
    ['blue text on dark', colors.primaryOnDark, colors.background],
    ['blue text on surface', colors.primaryOnDark, colors.surface],
    ['magenta text on dark', colors.removedOnDark, colors.background],
    ['magenta text on surface', colors.removedOnDark, colors.surface],
    ['receipt text', colors.onPaper, colors.paper],
    ['receipt MESSAGES value', colors.paperKept, colors.paper],
    ['REFUNDED stamp label', colors.onRemoved, colors.removedText],
    ['magenta text on white', colors.removedText, palette.white],
    ['secondary text on light', colors.textMutedOnLight, colors.lightSurface],
    ['blue tint', colors.onBlueTint, colors.blueTint],
    ['magenta tint', colors.onMagentaTint, colors.magentaTint],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(BODY);
  });
});

describe('brand contrast: graphics and outlines (3:1)', () => {
  const pairs: [string, string, string][] = [
    ['blue fill or outline on dark', colors.primary, colors.background],
    ['blue fill or outline on surface', colors.primary, colors.surface],
    ['progress line', colors.primaryOnDark, colors.hairline],
    ['strike-through on receipt', colors.removed, colors.paper],
    ['clock centre dot', colors.removed, colors.surface],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(GRAPHIC);
  });
});

describe('palette rules', () => {
  it('uses the stamp-safe magenta under white text, because the bright magenta fails 4.5:1', () => {
    expect(contrast(palette.white, palette.magenta)).toBeLessThan(BODY);
    expect(colors.removedText).toBe(palette.magentaText);
  });

  it('keeps no old lime/orange values', () => {
    const all = JSON.stringify({ colors, palette }).toUpperCase();
    for (const old of ['#C6FF3D', '#FF5A36', '#F4F1EA', '#0B0B0C', '#151517', '#26262A', '#8C8A84']) expect(all).not.toContain(old);
  });
});
