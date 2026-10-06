import { Text, type TextProps } from 'react-native';
import { colors, MAX_FONT_SCALE, typeScale, type ColorName, type TypeVariant } from '@/theme/tokens';

interface Props extends TextProps {
  variant?: TypeVariant;
  /** Palette colour; defaults to paper (muted when `muted` is set). */
  tone?: ColorName;
  muted?: boolean;
  center?: boolean;
}

const HEADINGS: readonly TypeVariant[] = ['display', 'title', 'heading'];

export function AppText({ variant = 'body', tone, muted, center, style, ...rest }: Props) {
  const color = colors[tone ?? (muted ? 'muted' : 'paper')];
  return (
    <Text
      accessibilityRole={HEADINGS.includes(variant) ? 'header' : undefined}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[typeScale[variant], { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
