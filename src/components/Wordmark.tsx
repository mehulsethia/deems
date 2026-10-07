import { Text, type TextStyle } from 'react-native';
import { colors, MAX_FONT_SCALE, typeScale, type TypeVariant } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

/** The product name as written everywhere: D, M and s carry the name, the two e's step back. */
export const BRAND_NAME = 'DeeMs';

interface Props {
  variant?: TypeVariant;
  /** onDark: white with grey e's. onLight: ink with slate e's (for the white receipt paper). */
  on?: 'dark' | 'light';
  style?: TextStyle;
}

/**
 * The wordmark "DeeMs". The eye reads "DMs" first and "Deems" second.
 * Screen readers hear "Deems".
 */
export function Wordmark({ variant = 'heading', on = 'dark', style }: Props) {
  const { headlineScale } = useLayout();
  const base = typeScale[variant];
  const heading = variant === 'display' || variant === 'title' || variant === 'heading';
  const size = heading ? { fontSize: Math.round((base.fontSize ?? 17) * headlineScale) } : null;
  const strong = on === 'dark' ? colors.text : colors.onPaper;
  const dim = on === 'dark' ? colors.textMuted : colors.textMutedOnLight;
  return (
    <Text
      accessibilityLabel="Deems"
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[base, size, { color: strong }, style]}
    >
      D<Text style={{ color: dim }}>ee</Text>Ms
    </Text>
  );
}
