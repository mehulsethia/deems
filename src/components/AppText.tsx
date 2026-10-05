import { Text, type TextProps, type TextStyle } from 'react-native';
import { fonts, typeScale } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodyMedium' | 'small' | 'caption';

const variants: Record<Variant, TextStyle> = {
  display: { ...typeScale.display, fontFamily: fonts.heading },
  title: { ...typeScale.title, fontFamily: fonts.heading },
  heading: { ...typeScale.heading, fontFamily: fonts.heading },
  body: { ...typeScale.body, fontFamily: fonts.body },
  bodyMedium: { ...typeScale.body, fontFamily: fonts.bodyMedium },
  small: { ...typeScale.small, fontFamily: fonts.body },
  caption: { ...typeScale.caption, fontFamily: fonts.body },
};

interface Props extends TextProps {
  variant?: Variant;
  muted?: boolean;
  accent?: boolean;
  center?: boolean;
}

export function AppText({ variant = 'body', muted, accent, center, style, ...rest }: Props) {
  const { colors } = useTheme();
  const color = accent ? colors.accent : muted ? colors.muted : colors.text;
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <Text
      accessibilityRole={isHeading ? 'header' : undefined}
      maxFontSizeMultiplier={1.5}
      style={[variants[variant], { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
