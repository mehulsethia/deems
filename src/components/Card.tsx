import { View, type ViewProps } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[{ backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md }, style]}
      {...rest}
    />
  );
}
