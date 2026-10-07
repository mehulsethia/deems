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
    ['secondary button label', colors.text, colors.background],
    ['white text and links on dark', colors.primaryOnDark, colors.background],
    ['white text and links on surface', colors.primaryOnDark, colors.surface],
    ['removed text on dark', colors.removedOnDark, colors.background],
    ['removed text on surface', colors.removedOnDark, colors.surface],
    ['receipt text', colors.onPaper, colors.paper],
    ['receipt MESSAGES value', colors.paperKept, colors.paper],
    ['REFUNDED stamp label', colors.onRemoved, colors.removedText],
    ['secondary text on white', colors.textMutedOnLight, colors.paper],
    ['secondary text on light', colors.textMutedOnLight, colors.lightSurface],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(BODY);
  });
});

describe('brand contrast: graphics and outlines (3:1)', () => {
  const pairs: [string, string, string][] = [
    ['selected fill or outline on dark', colors.primary, colors.background],
    ['selected fill or outline on surface', colors.primary, colors.surface],
    ['progress line', colors.primaryOnDark, colors.hairline],
    ['strike-through on receipt', colors.removed, colors.paper],
    ['clock centre dot', colors.removed, colors.surface],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(GRAPHIC);
  });
});

describe('palette rules', () => {
  const grey = (hex: string) => hex.slice(1, 3) === hex.slice(3, 5) && hex.slice(3, 5) === hex.slice(5, 7);

  it('keeps every UI colour greyscale, like the site', () => {
    for (const [name, value] of Object.entries(colors)) {
      if (value.startsWith('#')) expect([name, grey(value)]).toEqual([name, true]);
    }
  });

  it('keeps brand colour to the mark only', () => {
    const ui = JSON.stringify(colors).toUpperCase();
    expect(ui).not.toContain(palette.markBlue.toUpperCase());
    expect(ui).not.toContain(palette.markMagenta.toUpperCase());
  });

  it('keeps no old palette values', () => {
    const all = JSON.stringify({ colors, palette }).toUpperCase();
    for (const old of ['#C6FF3D', '#FF5A36', '#5B93FF', '#FF5C9F', '#D81B72', '#0B4FD6', '#17191E', '#B4B9C2']) expect(all).not.toContain(old);
  });
});
