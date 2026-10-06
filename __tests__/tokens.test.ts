import { colors } from '../src/theme/tokens';

/** WCAG relative luminance contrast ratio. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('brand contrast', () => {
  it('body text on background meets 4.5:1', () => {
    expect(contrast(colors.paper, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.muted, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('text on surfaces meets 4.5:1', () => {
    expect(contrast(colors.paper, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.muted, colors.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('text on lime and on the receipt paper meets 4.5:1', () => {
    expect(contrast(colors.ink, colors.keep)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.ink, colors.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('orange marks are visible on paper and background', () => {
    expect(contrast(colors.cut, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.cut, colors.paper)).toBeGreaterThanOrEqual(2.5);
  });
});
