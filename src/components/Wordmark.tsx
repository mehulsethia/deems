import { Text, type TextStyle } from 'react-native';
import { colors, fonts, MAX_FONT_SCALE, typeScale, type TypeVariant } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

/** The product name as written everywhere. */
export const BRAND_NAME = 'OnlyDM';

interface Props {
  variant?: TypeVariant;
  /** onDark: white. onLight: ink (for the white receipt paper). */
  on?: 'dark' | 'light';
  style?: TextStyle;
}

/**
 * The wordmark "OnlyDM": a regular-weight "Only" and a heavy "DM", so the eye lands on "DM".
 * Screen readers hear "OnlyDM".
 */
export function Wordmark({ variant = 'heading', on = 'dark', style }: Props) {
  const { headlineScale } = useLayout();
  const base = typeScale[variant];
  const heading = variant === 'display' || variant === 'title' || variant === 'heading';
  const fontSize = heading ? Math.round((base.fontSize ?? 17) * headlineScale) : (base.fontSize ?? 17);
  const size = heading ? { fontSize } : null;
  const color = on === 'dark' ? colors.text : colors.onPaper;
  return (
    <Text
      accessibilityLabel={BRAND_NAME}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[base, size, { color, fontFamily: fonts.brandHeavy }, style]}
    >
      <Text style={{ fontFamily: fonts.headlineRegular }}>Only</Text>DM
    </Text>
  );
}
