import Svg, { Circle, Path } from 'react-native-svg';
import { palette } from '@/theme/tokens';

/**
 * The OnlyDM mark: a speech bubble with three dots. Same path data as
 * assets/brand/onlydm-mark-dark.svg and onlydm-mark-light.svg; do not redraw.
 * Dot colours are fixed (blue, magenta, then the background colour).
 */
export const MARK_VIEWBOX = '6 12 108 100';
export const MARK_BUBBLE = 'M46 16h28a36 36 0 0 1 0 72H50L26 108l2-25.5A36 36 0 0 1 46 16z';
export const MARK_DOTS = [38, 60, 82] as const;
export const MARK_DOT = { cy: 52, r: 9 } as const;

export type MarkVariant = 'onDark' | 'onLight';

/** Bubble fill and dot colours for each background. */
export const markColors = (variant: MarkVariant) =>
  variant === 'onDark'
    ? { bubble: palette.white, dots: [palette.markBlue, palette.markMagenta, palette.markInk] as const }
    : { bubble: palette.markInk, dots: [palette.markBlue, palette.markMagenta, palette.white] as const };

/** Width-to-height ratio of the mark's view box. */
export const MARK_ASPECT = 108 / 100;

interface Props {
  /** Height in points; width follows the mark's aspect ratio. */
  size?: number;
  variant?: MarkVariant;
  /** Accessible name. Omit when the mark sits next to the word "OnlyDM". */
  label?: string;
}

export function OnlyDMMark({ size = 32, variant = 'onDark', label }: Props) {
  const c = markColors(variant);
  return (
    <Svg
      width={size * MARK_ASPECT}
      height={size}
      viewBox={MARK_VIEWBOX}
      accessible={!!label}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
    >
      <Path d={MARK_BUBBLE} fill={c.bubble} />
      {MARK_DOTS.map((cx, i) => (
        <Circle key={cx} cx={cx} cy={MARK_DOT.cy} r={MARK_DOT.r} fill={c.dots[i]} />
      ))}
    </Svg>
  );
}
