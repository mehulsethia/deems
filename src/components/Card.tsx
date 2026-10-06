import { View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, padding: spacing.md }, style]}
      {...rest}
    />
  );
}
