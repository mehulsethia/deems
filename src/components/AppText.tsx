import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, MAX_FONT_SCALE, typeScale, type ColorName, type TypeVariant } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

interface Props extends TextProps {
  variant?: TypeVariant;
  /** Semantic colour; defaults to text (textMuted when `muted` is set). */
  tone?: ColorName;
  muted?: boolean;
  center?: boolean;
}

const HEADINGS: readonly TypeVariant[] = ['display', 'title', 'heading'];

/** Headlines scale a little with the screen; body sizes stay fixed so Dynamic Type stays predictable. */
function scaled(style: TextStyle, k: number): TextStyle {
  if (k === 1) return style;
  return {
    ...style,
    fontSize: Math.round((style.fontSize ?? 17) * k),
    lineHeight: style.lineHeight ? Math.round(style.lineHeight * k) : undefined,
    letterSpacing: style.letterSpacing ? style.letterSpacing * k : undefined,
  };
}

export function AppText({ variant = 'body', tone, muted, center, style, ...rest }: Props) {
  const { headlineScale } = useLayout();
  const heading = HEADINGS.includes(variant);
  const color = colors[tone ?? (muted ? 'textMuted' : 'text')];
  return (
    <Text
      accessibilityRole={heading ? 'header' : undefined}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[heading ? scaled(typeScale[variant], headlineScale) : typeScale[variant], { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
